// JavaScript controls behavior and interactivity.
// HTML gives the structure.
// CSS gives the appearance.
// JavaScript gives the page actions.

// ============================================================================
// TOPICS DATA
// ============================================================================
// This is the searchable index of all study topics.
// To add more topics, just add an object to this array with title and slug.
// The slug is used in URLs and should be unique and URL-safe.
// ============================================================================

const topics = [
	{
		title: "SAT: Math",
		slug: "sat-math",
		summary:
			"Includes algebra, geometry, and data analysis. Most questions are calculator and non-calculator based, with about 58 questions total.",
		metrics: [
			{ label: "Pass Rate", value: "65%" },
			{ label: "Avg Time", value: "3 hrs" },
		],
	},
	{
		title: "SAT: Reading & Writing",
		slug: "sat-reading-writing",
		summary:
			"Tests reading comprehension and grammar. The section includes passage-based reading and writing/editing questions.",
		metrics: [
			{ label: "Pass Rate", value: "58%" },
			{ label: "Avg Time", value: "3 hrs" },
		],
	},
	{
		title: "AP Chemistry",
		slug: "ap-chemistry",
		summary:
			"Covers atomic structure, reactions, thermodynamics, and lab-based reasoning. The exam has multiple choice and free response sections.",
		metrics: [
			{ label: "AP 5 Rate", value: "15%" },
			{ label: "Avg Time", value: "5 hrs" },
		],
	},
	{
		title: "AP Lang & Composition",
		slug: "ap-lang-comp",
		summary:
			"Focuses on rhetorical analysis, argument, and synthesis. The exam is mostly essay-based with some multiple-choice reading questions.",
		metrics: [
			{ label: "AP 5 Rate", value: "10%" },
			{ label: "Avg Time", value: "4 hrs" },
		],
	},
	{
		title: "AP US History",
		slug: "ap-us-history",
		summary:
			"Tests U.S. history knowledge from pre-colonial times to the present, including documents and essay writing.",
		metrics: [
			{ label: "AP 5 Rate", value: "12%" },
			{ label: "Avg Time", value: "5 hrs" },
		],
	},
	{
		title: "AP Biology",
		slug: "ap-biology",
		summary:
			"Includes molecules, cells, genetics, evolution, and ecology. The exam combines multiple-choice and free-response questions.",
		metrics: [
			{ label: "AP 5 Rate", value: "21%" },
			{ label: "Avg Time", value: "5 hrs" },
		],
	},
	{
		title: "AP Calculus",
		slug: "ap-calculus",
		summary:
			"Covers limits, derivatives, integrals, and the Fundamental Theorem of Calculus. The test is calculation-heavy and concept-driven.",
	},
	{
		title: "AP Physics",
		slug: "ap-physics",
		summary:
			"Covers mechanics, electricity, waves, and thermodynamics. Often split into multiple exam variants depending on the course level.",
	},
	{
		title: "AP Government & Politics",
		slug: "ap-government",
		summary:
			"Focuses on U.S. government institutions, political behavior, and public policy. The exam combines multiple choice and free-response questions.",

	},
	{
		title: "AP Literature",
		slug: "ap-literature",
		summary:
			"Tests reading and writing skills through poetry, prose, and literary analysis. The exam includes multiple-choice and essay sections.",
		
	}
];

const topicStats = {
	"sat-math": { sections: "2", passRate: "65%", fiveRate: "—" },
	"sat-reading-writing": { sections: "2", passRate: "58%", fiveRate: "—" },
	"ap-chemistry": { sections: "2", passRate: "65%", fiveRate: "15%" },
	"ap-lang-comp": { sections: "2", passRate: "60%", fiveRate: "10%" },
	"ap-us-history": { sections: "3", passRate: "62%", fiveRate: "12%" },
	"ap-biology": { sections: "2", passRate: "63%", fiveRate: "21%" },
	"ap-calculus": { sections: "2", passRate: "60%", fiveRate: "24%" },
	"ap-physics": { sections: "2", passRate: "58%", fiveRate: "15%" },
	"ap-government": { sections: "2", passRate: "65%", fiveRate: "20%" },
	"ap-literature": { sections: "2", passRate: "62%", fiveRate: "10%" },
};

function getTopicStats(slug) {
	return topicStats[slug] || { sections: "N/A", passRate: "N/A", fiveRate: "N/A" };
}

// ============================================================================
// SEARCH FUNCTIONALITY (HOMEPAGE)
// ============================================================================

// Initialize search on homepage if elements exist
document.addEventListener("DOMContentLoaded", function () {
	const searchInput = document.getElementById("searchInput");
	const searchDropdown = document.getElementById("searchDropdown");

	if (searchInput) {
		// When user types, filter topics and display results
		searchInput.addEventListener("input", function (e) {
			const query = e.target.value.toLowerCase().trim();

			// If search is empty, hide dropdown
			if (query === "") {
				searchDropdown.innerHTML = "";
				searchDropdown.style.display = "none";
				return;
			}

			// Filter topics based on query
			const results = topics.filter((topic) =>
				topic.title.toLowerCase().includes(query)
			);

			// Display results in dropdown
			if (results.length > 0) {
				searchDropdown.innerHTML = results
					.map(
						(result) =>
							`
					<div class="search-result-item" role="option" data-slug="${result.slug}">
						${result.title}
					</div>
					`
					)
					.join("");
				searchDropdown.style.display = "block";

				// Add click handler to each result
				document.querySelectorAll(".search-result-item").forEach((item) => {
					item.addEventListener("click", function () {
						const slug = this.getAttribute("data-slug");
						window.location.href = `topic.html?topic=${slug}`;
					});
				});
			} else {
				searchDropdown.innerHTML =
					'<div class="search-no-results">No topics found</div>';
				searchDropdown.style.display = "block";
			}
		});

		// Keyboard navigation: Escape closes dropdown
		searchInput.addEventListener("keydown", function (e) {
			if (e.key === "Escape") {
				searchDropdown.innerHTML = "";
				searchDropdown.style.display = "none";
			}
		});

		// Close dropdown when clicking outside
		document.addEventListener("click", function (e) {
			if (e.target !== searchInput && e.target !== searchDropdown) {
				searchDropdown.style.display = "none";
			}
		});
	}

	// ========================================================================
	// TOPIC PAGE INITIALIZATION
	// ========================================================================
	// This runs on topic.html to load and display topic-specific content

	const topicTitle = document.getElementById("topicTitle");
	if (topicTitle) {
		// Get topic from URL parameter
		const params = new URLSearchParams(window.location.search);
		const topicSlug = params.get("topic");

		// Find the topic data
		const topic = topics.find((t) => t.slug === topicSlug);

		if (topic) {
			// Display topic title
			topicTitle.textContent = topic.title;

			// Display topic summary
			const topicSummary = document.getElementById("topicSummary");
			if (topicSummary) {
				topicSummary.textContent = topic.summary;
			}

			// Display compact topic stats
			const topicSections = document.getElementById("topicSections");
			const topicPassRate = document.getElementById("topicPassRate");
			const topicFiveRate = document.getElementById("topicFiveRate");
			const stats = getTopicStats(topic.slug);
			if (topicSections) topicSections.textContent = stats.sections;
			if (topicPassRate) topicPassRate.textContent = stats.passRate;
			if (topicFiveRate) topicFiveRate.textContent = stats.fiveRate;

			// Set page title in browser tab
			document.title = `${topic.title} | Study AI Helper`;
		} else {
			// If topic not found, show error
			topicTitle.textContent = "Topic not found";
			const topicSummary = document.getElementById("topicSummary");
			if (topicSummary) {
				topicSummary.textContent = "The topic you selected does not exist yet.";
			}
			document.title = "Topic Not Found | Study AI Helper";
		}
	}

	// Wire up topic action buttons on topic page
	const topicActionButtons = document.querySelectorAll(".topic-action-btn");
	topicActionButtons.forEach((button) => {
		button.addEventListener("click", function () {
			const method = this.getAttribute("data-method");
			if (method === "View Topics") {
				window.location.href = "index.html";
				return;
			}
			alert(
				`You selected: ${method}\n\nThis feature is coming soon! For now, this is a placeholder.`
			);
		});
	});
});

