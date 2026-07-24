import { getDomain, getSubject } from '../taxonomy/contentTaxonomy.js'
import { editorialResources, getEditorialResource } from './resourceCatalog.js'

const ROUTES = Object.freeze({ lesson: '/learn.html', formula: '/formulas.html' })

export function createResourceBrowserUrl(subjectId, domainId = null) {
  const subject = getSubject(subjectId)
  const domain = domainId ? getDomain(subjectId, domainId) : null
  if (!subject || (domainId && !domain)) return null
  const params = new URLSearchParams({ topic: subject.id })
  if (domain) params.set('domain', domain.id)
  return `/topics.html?${params.toString()}`
}

export function getResourceUnitLabel(domain) {
  if (!domain?.label || !domain?.officialNumber) return null
  return `Unit ${domain.officialNumber}: ${domain.label}`
}

export function createResourceUrl(resource) {
  const path = ROUTES[resource?.kind]
  if (!path) return null
  const params = new URLSearchParams({
    test: resource.alignment.subjectId,
    unit: resource.alignment.domainId,
    [resource.kind]: resource.id,
  })
  return `${path}?${params.toString()}`
}

export function resolveResourceRoute({ pathname, search }, { includeDrafts = false } = {}) {
  const kind = pathname?.endsWith('/learn.html') ? 'lesson'
    : pathname?.endsWith('/formulas.html') ? 'formula'
      : null
  if (!kind) return { status: 'invalid-route', resource: null }
  const params = new URLSearchParams(search || '')
  const subjectId = params.get('test')
  const domainId = params.get('unit')
  const resourceId = params.get(kind)
  const subject = getSubject(subjectId)
  const domain = getDomain(subjectId, domainId)
  if (!subject || !domain) return { status: 'invalid-target', kind, resource: null }
  if (!resourceId && kind === 'formula') return { status: 'index', kind, subject, domain, resource: null }
  if (!resourceId) return { status: 'invalid-target', kind, subject, domain, resource: null }

  const unfiltered = editorialResources.find(({ id }) => id === resourceId) || null
  if (!unfiltered || unfiltered.kind !== kind
    || unfiltered.alignment.subjectId !== subjectId
    || unfiltered.alignment.domainId !== domainId) {
    return { status: 'invalid-target', kind, subject, domain, resource: null }
  }
  const resource = getEditorialResource(resourceId, { includeDrafts })
  if (!resource) return { status: 'draft-hidden', kind, subject, domain, resource: null }
  return { status: 'valid', kind, subject, domain, resource }
}
