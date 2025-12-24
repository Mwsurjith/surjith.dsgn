/**
 * Nielsen's 10 Usability Heuristics Data
 * Complete dataset for heuristic evaluation checklists
 * Moved to src/constants for cleaner architecture
 */

export const heuristics = [
    {
        id: 1,
        name: "Visibility of System Status",
        description: "The design should always keep users informed about what is going on, through appropriate feedback within a reasonable amount of time.",
        categories: [
            {
                name: "Before Page Load",
                items: [
                    {
                        id: "1-1-1",
                        title: "Skeleton Loader for structured content",
                        description: "Does the page has skeleton loader for structured content like card or table inform users when system is processing their request?"
                    },
                    {
                        id: "1-1-2",
                        title: "Spinner Loader for single block/small content",
                        description: "Does the page has spinner loader for unstructured or small area like image to inform users when system is processing their request?"
                    },
                    {
                        id: "1-1-3",
                        title: "Progress Loader",
                        description: "Does the page has determinate progress indicators if the page loading take more than 10s to inform users how much time it will take to processing their request?"
                    },
                    {
                        id: "1-1-4",
                        title: "Loading label",
                        description: "Does the loading page has label to inform users what is being processed?"
                    },
                    {
                        id: "1-1-5",
                        title: "Authentication Check Status",
                        description: "If the page must verify login/session before showing content, do we show \"Signing you in...\" / \"Checking session...\" so users don't mistake it for a crash?"
                    },
                    {
                        id: "1-1-6",
                        title: "Offline / Network Detected Early",
                        description: "If the device is offline or network is unstable, do we show an early banner/message so users understand why loading isn't progressing?"
                    },
                    {
                        id: "1-1-7",
                        title: "\"Still Loading\" Fallback",
                        description: "If initial load takes unusually long, do we show a \"Still loading...\" state with options (retry/go back) so users aren't trapped in a screen?"
                    },
                    {
                        id: "1-1-8",
                        title: "Prioritized First Meaningful Content",
                        description: "Does the page show the most meaningful part first (header + key summary) so users feel progress even if secondary widgets still load?"
                    }
                ]
            },
            {
                name: "After page load",
                items: [
                    {
                        id: "1-2-1",
                        title: "Page Name / Location",
                        description: "Does the page show a clear title that matches the content so users always know where they are?"
                    },
                    {
                        id: "1-2-2",
                        title: "Navigation Indicator",
                        description: "If there are multiple pages/tabs/menus, is the current location clearly highlighted so users don’t feel lost?"
                    },
                    {
                        id: "1-2-3",
                        title: "Empty State Explanation",
                        description: "When there is no data, does the page explain why (new account / filters too strict / no permission) and what to do next, so users don’t think it failed to load?"
                    },
                    {
                        id: "1-2-4",
                        title: "Network Connection Status",
                        description: "Is the system's network connection status clearly indicated, especially when there are network problems or reestablishments?"
                    },
                    {
                        id: "1-2-5",
                        title: "Offline Mode",
                        description: "If offline, do we show what still works and what won’t, so users understand limitations instead of thinking the app is broken?"
                    },
                    {
                        id: "1-2-6",
                        title: "Real-Time Updates",
                        description: "Does the system promptly display new information in real-time data scenarios, such as chat applications, without requiring manual refresh?"
                    },
                    {
                        id: "1-2-7",
                        title: "Data Freshness (Last Updated)",
                        description: "If the page shows time-sensitive data (market, transactions, metrics), does it show “Live” or “Last updated at…” so users don’t assume stale data is current?"
                    },
                    {
                        id: "1-2-8",
                        title: "Sync Status",
                        description: "If the system syncs in the background (multi-device, cloud), does it show “Syncing / Up to date / Sync failed” so users know whether data is reliable right now?"
                    },
                    {
                        id: "1-2-9",
                        title: "Timeout Warnings",
                        description: "If there's a possibility of session timeouts due to inactivity, is there clear notification provided in advance with options to extend the session or log in again without data loss?"
                    },
                    {
                        id: "1-2-10",
                        title: "Service Degraded / Maintenance Banner",
                        description: "If the system is partially down or slow, do we communicate it clearly so users blame reality, not themselves?"
                    }
                ]
            },
            {
                name: "At interaction (user clicks/taps/edits)",
                items: [
                    {
                        id: "1-3-1",
                        title: "Instant Tap Feedback",
                        description: "On every tap/click, does the UI respond immediately (pressed state, ripple, active state) so users don’t double-tap thinking it didn’t register?"
                    },
                    {
                        id: "1-3-2",
                        title: "Processing State on Action",
                        description: "When an action takes more than a 400ms (submit, save, apply filters), does the UI show “Working…” near the action so users know it’s in progress?"
                    },
                    {
                        id: "1-3-3",
                        title: "Prevent Double Submission",
                        description: "When submitting a form/payment/OTP, does the button become loading/disabled so users can’t accidentally submit twice?"
                    },
                    {
                        id: "1-3-4",
                        title: "Inline Status Near the Affected Area",
                        description: "Does the feedback appear where the change happens (inside the card/row/field) instead of only a global toast, so users connect cause → effect?"
                    },
                    {
                        id: "1-3-5",
                        title: "Success Confirmation",
                        description: "After an action completes, does the UI confirm success (“Saved”, “Added”, “Sent”) so users don’t wonder if it worked?"
                    },
                    {
                        id: "1-3-6",
                        title: "Error Feedback (Action-level)",
                        description: "If an action fails, does the UI explain what happened in simple terms and offer a next step (retry/edit) so users can recover immediately?"
                    },
                    {
                        id: "1-3-7",
                        title: "Auto-save Status (If used)",
                        description: "If the product auto-saves, is it visible (“Saving draft… / Saved”) so users don’t fear losing work?"
                    },
                    {
                        id: "1-3-8",
                        title: "Queued Actions Visibility",
                        description: "If we queue actions while offline (“Will sync when online”), is that visible so users know their action is pending?"
                    }
                ]
            },
            {
                name: "Long-running tasks (uploads, exports, imports, heavy reports)",
                items: [
                    {
                        id: "1-4-1",
                        title: "Determinate Progress",
                        description: "When the task duration is meaningful, do we show percent or step progress so users know it’s moving forward?"
                    },
                    {
                        id: "1-4-2",
                        title: "What Exactly Is Running",
                        description: "Do we show what’s being processed (file name, item count, report type) so users can confirm it’s the right job?"
                    },
                    {
                        id: "1-4-3",
                        title: "Time Estimate Only If Trustworthy",
                        description: "If we show “X minutes left”, is it accurate enough to trust, so we don’t create frustration with fake promises?"
                    },
                    {
                        id: "1-4-4",
                        title: "Background Mode",
                        description: "Can users leave the page if the process will take longer than 60 seconds and still track progress (job center, notification) so they’re not forced to stare at a spinner?"
                    },
                    {
                        id: "1-4-5",
                        title: "Clear Completion State",
                        description: "When finished, does the system clearly say it’s done and show the output (download link / success page), so users don’t miss the result?"
                    }
                ]
            }
        ]
    },
    {
        id: 2,
        name: "Match Between System and Real World",
        description: "The design should speak the users' language. Use words, phrases, and concepts familiar to the user, rather than internal jargon.",
        categories: [
            {
                name: "Language & Terminology",
                items: [
                    {
                        id: "2-1-1",
                        title: "User-friendly vocabulary",
                        description: "Does the interface use simple, everyday words that users understand rather than technical jargon?"
                    },
                    {
                        id: "2-1-2",
                        title: "Consistent terminology",
                        description: "Are the same terms used consistently throughout the interface for the same concepts?"
                    },
                    {
                        id: "2-1-3",
                        title: "Industry-appropriate language",
                        description: "Does the language match what users in this domain would expect to see?"
                    },
                    {
                        id: "2-1-4",
                        title: "Clear labels and headings",
                        description: "Are labels and headings descriptive and meaningful to users?"
                    }
                ]
            },
            {
                name: "Mental Models & Metaphors",
                items: [
                    {
                        id: "2-2-1",
                        title: "Familiar metaphors",
                        description: "Does the design use metaphors that match real-world objects or processes users already understand?"
                    },
                    {
                        id: "2-2-2",
                        title: "Natural information order",
                        description: "Is information presented in a logical order that matches user expectations?"
                    },
                    {
                        id: "2-2-3",
                        title: "Recognizable icons",
                        description: "Do icons represent real-world objects or universally understood symbols?"
                    }
                ]
            }
        ]
    },
    {
        id: 3,
        name: "User Control and Freedom",
        description: "Users often perform actions by mistake. They need a clearly marked 'emergency exit' to leave the unwanted action without having to go through an extended process.",
        categories: [
            {
                name: "Navigation & Exit",
                items: [
                    {
                        id: "3-1-1",
                        title: "Undo functionality",
                        description: "Can users easily undo recent actions?"
                    },
                    {
                        id: "3-1-2",
                        title: "Redo functionality",
                        description: "Can users redo actions they've undone?"
                    },
                    {
                        id: "3-1-3",
                        title: "Cancel option",
                        description: "Can users cancel ongoing processes or dialogs easily?"
                    },
                    {
                        id: "3-1-4",
                        title: "Clear exit points",
                        description: "Are there clear ways to exit from any state or modal?"
                    },
                    {
                        id: "3-1-5",
                        title: "Back navigation",
                        description: "Does the back button work as expected throughout the interface?"
                    }
                ]
            },
            {
                name: "Data Control",
                items: [
                    {
                        id: "3-2-1",
                        title: "Draft saving",
                        description: "Is user input automatically saved to prevent data loss?"
                    },
                    {
                        id: "3-2-2",
                        title: "Delete confirmation",
                        description: "Are users asked to confirm before destructive actions?"
                    },
                    {
                        id: "3-2-3",
                        title: "Recovery options",
                        description: "Can deleted items be recovered (trash/recycle bin)?"
                    }
                ]
            }
        ]
    },
    {
        id: 4,
        name: "Consistency and Standards",
        description: "Users should not have to wonder whether different words, situations, or actions mean the same thing. Follow platform and industry conventions.",
        categories: [
            {
                name: "Visual Consistency",
                items: [
                    {
                        id: "4-1-1",
                        title: "Consistent button styles",
                        description: "Do buttons look and behave the same way throughout the interface?"
                    },
                    {
                        id: "4-1-2",
                        title: "Consistent color usage",
                        description: "Are colors used consistently to convey the same meanings?"
                    },
                    {
                        id: "4-1-3",
                        title: "Consistent typography",
                        description: "Is typography (fonts, sizes, weights) used consistently for similar content types?"
                    },
                    {
                        id: "4-1-4",
                        title: "Consistent spacing",
                        description: "Is spacing between elements consistent throughout the design?"
                    }
                ]
            },
            {
                name: "Behavioral Consistency",
                items: [
                    {
                        id: "4-2-1",
                        title: "Consistent interaction patterns",
                        description: "Do similar elements behave the same way when interacted with?"
                    },
                    {
                        id: "4-2-2",
                        title: "Platform conventions",
                        description: "Does the design follow platform-specific conventions (iOS/Android/Web)?"
                    },
                    {
                        id: "4-2-3",
                        title: "Industry standards",
                        description: "Does the design follow industry-standard patterns and conventions?"
                    }
                ]
            }
        ]
    },
    {
        id: 5,
        name: "Error Prevention",
        description: "Good error messages are important, but the best designs carefully prevent problems from occurring in the first place.",
        categories: [
            {
                name: "Input Validation",
                items: [
                    {
                        id: "5-1-1",
                        title: "Real-time validation",
                        description: "Are form inputs validated in real-time before submission?"
                    },
                    {
                        id: "5-1-2",
                        title: "Input constraints",
                        description: "Are appropriate constraints applied to prevent invalid input (e.g., date pickers, dropdowns)?"
                    },
                    {
                        id: "5-1-3",
                        title: "Format hints",
                        description: "Are input format requirements clearly communicated before errors occur?"
                    },
                    {
                        id: "5-1-4",
                        title: "Auto-formatting",
                        description: "Does the system auto-format input where possible (phone numbers, dates)?"
                    }
                ]
            },
            {
                name: "Confirmation & Protection",
                items: [
                    {
                        id: "5-2-1",
                        title: "Destructive action confirmation",
                        description: "Do destructive actions require confirmation before execution?"
                    },
                    {
                        id: "5-2-2",
                        title: "Accidental click prevention",
                        description: "Are destructive buttons positioned away from common actions?"
                    },
                    {
                        id: "5-2-3",
                        title: "Double-submit prevention",
                        description: "Are buttons disabled after click to prevent duplicate submissions?"
                    }
                ]
            }
        ]
    },
    {
        id: 6,
        name: "Recognition Rather Than Recall",
        description: "Minimize the user's memory load by making elements, actions, and options visible. The user should not have to remember information.",
        categories: [
            {
                name: "Visibility & Context",
                items: [
                    {
                        id: "6-1-1",
                        title: "Visible options",
                        description: "Are all available options visible rather than hidden in menus?"
                    },
                    {
                        id: "6-1-2",
                        title: "Contextual information",
                        description: "Is relevant information displayed when and where users need it?"
                    },
                    {
                        id: "6-1-3",
                        title: "Recently used items",
                        description: "Are recently used or frequently accessed items easily accessible?"
                    },
                    {
                        id: "6-1-4",
                        title: "Search suggestions",
                        description: "Does search provide suggestions and autocomplete?"
                    }
                ]
            },
            {
                name: "Labels & Instructions",
                items: [
                    {
                        id: "6-2-1",
                        title: "Persistent labels",
                        description: "Do form fields have visible labels (not just placeholders)?"
                    },
                    {
                        id: "6-2-2",
                        title: "In-context help",
                        description: "Is help information available without leaving the current context?"
                    },
                    {
                        id: "6-2-3",
                        title: "Breadcrumbs",
                        description: "Do breadcrumbs show users their location in the hierarchy?"
                    }
                ]
            }
        ]
    },
    {
        id: 7,
        name: "Flexibility and Efficiency of Use",
        description: "Shortcuts — hidden from novice users — may speed up the interaction for the expert user such that the design can cater to both inexperienced and experienced users.",
        categories: [
            {
                name: "Accelerators",
                items: [
                    {
                        id: "7-1-1",
                        title: "Keyboard shortcuts",
                        description: "Are keyboard shortcuts available for common actions?"
                    },
                    {
                        id: "7-1-2",
                        title: "Touch gestures",
                        description: "Are touch gestures (swipe, pinch) available where appropriate?"
                    },
                    {
                        id: "7-1-3",
                        title: "Quick actions",
                        description: "Can users access frequent actions with minimal steps?"
                    },
                    {
                        id: "7-1-4",
                        title: "Bulk actions",
                        description: "Can users perform actions on multiple items at once?"
                    }
                ]
            },
            {
                name: "Personalization",
                items: [
                    {
                        id: "7-2-1",
                        title: "Customizable interface",
                        description: "Can users customize the interface to match their preferences?"
                    },
                    {
                        id: "7-2-2",
                        title: "Saved preferences",
                        description: "Are user preferences saved and applied across sessions?"
                    },
                    {
                        id: "7-2-3",
                        title: "Favorites/bookmarks",
                        description: "Can users save frequently used items for quick access?"
                    }
                ]
            }
        ]
    },
    {
        id: 8,
        name: "Aesthetic and Minimalist Design",
        description: "Interfaces should not contain information which is irrelevant or rarely needed. Every extra unit of information competes with the relevant units.",
        categories: [
            {
                name: "Visual Clarity",
                items: [
                    {
                        id: "8-1-1",
                        title: "Visual hierarchy",
                        description: "Is there a clear visual hierarchy that guides attention to important elements?"
                    },
                    {
                        id: "8-1-2",
                        title: "Adequate whitespace",
                        description: "Is there sufficient whitespace to prevent visual clutter?"
                    },
                    {
                        id: "8-1-3",
                        title: "Focused content",
                        description: "Is content focused on what users need, without unnecessary elements?"
                    },
                    {
                        id: "8-1-4",
                        title: "Progressive disclosure",
                        description: "Is complex information revealed progressively rather than all at once?"
                    }
                ]
            },
            {
                name: "Content Quality",
                items: [
                    {
                        id: "8-2-1",
                        title: "Concise text",
                        description: "Is text concise and scannable?"
                    },
                    {
                        id: "8-2-2",
                        title: "Meaningful graphics",
                        description: "Do graphics serve a purpose rather than just decoration?"
                    },
                    {
                        id: "8-2-3",
                        title: "Noise reduction",
                        description: "Are distracting elements minimized or eliminated?"
                    }
                ]
            }
        ]
    },
    {
        id: 9,
        name: "Help Users Recognize, Diagnose, and Recover from Errors",
        description: "Error messages should be expressed in plain language (no error codes), precisely indicate the problem, and constructively suggest a solution.",
        categories: [
            {
                name: "Error Messages",
                items: [
                    {
                        id: "9-1-1",
                        title: "Plain language errors",
                        description: "Are error messages written in plain language without technical jargon or codes?"
                    },
                    {
                        id: "9-1-2",
                        title: "Specific error identification",
                        description: "Do error messages precisely identify what went wrong?"
                    },
                    {
                        id: "9-1-3",
                        title: "Actionable solutions",
                        description: "Do error messages suggest how to fix the problem?"
                    },
                    {
                        id: "9-1-4",
                        title: "Error visibility",
                        description: "Are errors displayed prominently and near the relevant field?"
                    }
                ]
            },
            {
                name: "Recovery Options",
                items: [
                    {
                        id: "9-2-1",
                        title: "Retry options",
                        description: "Can users easily retry failed actions?"
                    },
                    {
                        id: "9-2-2",
                        title: "Alternative paths",
                        description: "Are alternative ways to complete tasks suggested when errors occur?"
                    },
                    {
                        id: "9-2-3",
                        title: "Support access",
                        description: "Is there easy access to support or help when errors occur?"
                    }
                ]
            }
        ]
    },
    {
        id: 10,
        name: "Help and Documentation",
        description: "It's best if the system doesn't need any additional explanation. However, it may be necessary to provide documentation to help users complete their tasks.",
        categories: [
            {
                name: "Help Accessibility",
                items: [
                    {
                        id: "10-1-1",
                        title: "Easy to find help",
                        description: "Is help easily accessible from any point in the interface?"
                    },
                    {
                        id: "10-1-2",
                        title: "Contextual help",
                        description: "Is help content relevant to the user's current context or task?"
                    },
                    {
                        id: "10-1-3",
                        title: "Searchable documentation",
                        description: "Can users search through help documentation easily?"
                    },
                    {
                        id: "10-1-4",
                        title: "Multiple help formats",
                        description: "Is help available in multiple formats (text, video, tooltips)?"
                    }
                ]
            },
            {
                name: "Content Quality",
                items: [
                    {
                        id: "10-2-1",
                        title: "Task-focused documentation",
                        description: "Is documentation organized around user tasks rather than system features?"
                    },
                    {
                        id: "10-2-2",
                        title: "Step-by-step guidance",
                        description: "Does documentation provide clear step-by-step instructions?"
                    },
                    {
                        id: "10-2-3",
                        title: "Up-to-date content",
                        description: "Is help documentation kept current with the latest interface?"
                    },
                    {
                        id: "10-2-4",
                        title: "Onboarding/tutorials",
                        description: "Are there onboarding flows or tutorials for new users?"
                    }
                ]
            }
        ]
    }
];

/**
 * Get a specific heuristic by ID
 */
export const getHeuristicById = (id) => {
    return heuristics.find(h => h.id === id);
};

/**
 * Get total number of checklist items across all heuristics
 */
export const getTotalItemsCount = () => {
    return heuristics.reduce((total, heuristic) => {
        return total + heuristic.categories.reduce((catTotal, category) => {
            return catTotal + category.items.length;
        }, 0);
    }, 0);
};

/**
 * Get all item IDs for a specific heuristic
 */
export const getHeuristicItemIds = (heuristicId) => {
    const heuristic = getHeuristicById(heuristicId);
    if (!heuristic) return [];

    return heuristic.categories.flatMap(category =>
        category.items.map(item => item.id)
    );
};
