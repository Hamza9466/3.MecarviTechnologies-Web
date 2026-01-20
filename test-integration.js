// Simple test to verify job sections API integration
// Run this in browser console when on the admin careers page

console.log("Testing Job Sections Integration...");

// Test if the hook is properly loaded
if (typeof window !== "undefined") {
    // Check if we're on the careers page
    if (window.location.pathname.includes("/admin/careers")) {
        console.log("✅ On careers page");

        // Wait a moment for the component to load
        setTimeout(() => {
            // Check if job sections are being loaded
            const jobCards = document.querySelectorAll('[class*="JOB #"]');
            console.log(`✅ Found ${jobCards.length} job cards`);

            // Check if the Jobs tab is present
            const jobsTab = Array.from(document.querySelectorAll("button")).find(btn =>
                btn.textContent?.includes("Jobs")
            );

            if (jobsTab) {
                console.log("✅ Jobs tab found");
                jobsTab.click();

                setTimeout(() => {
                    console.log("✅ Jobs tab clicked - check if job sections are loaded");
                }, 1000);
            } else {
                console.log("❌ Jobs tab not found");
            }
        }, 2000);
    } else {
        console.log("❌ Not on careers page");
    }
}
