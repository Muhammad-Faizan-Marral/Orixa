const en = {
  common: {
    save: "Save",
    saving: "Saving...",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    create: "Create",
    back: "Back",
    loading: "Loading...",
    success: "Success",
    error: "Something went wrong",
    close: "Close",
    continue: "Continue",
    view: "View",
    publish: "Publish",
    unpublish: "Unpublish",
    archive: "Archive",
    restore: "Restore",
    preview: "Preview",
  },

  nav: {
    overview: "Overview",
    portfolios: "Portfolios",
    profile: "Profile",
    settings: "Settings",
    newPortfolio: "+ New portfolio",
    createPortfolio: "+ Create portfolio",
    closeSidebar: "Close sidebar",
    logout: "Log out",
  },

  dashboard: {
    welcomeBack: "Welcome back",
    portfolios: "Portfolios",
    published: "Published",
    totalViews: "Total views",
    profileCompletion: "Profile completion",
    addMoreDetails: "Add more details to your profile",
    lookingSharp: "Looking sharp",
    recentPortfolios: "Recent portfolios",
    noPortfoliosYet: "You haven't created a portfolio yet.",
    createFirst: "Create your first portfolio",
    viewAll: "View all",
  },

  settings: {
    account: "Account",
    title: "Settings",
    subtitle:
      "Manage how Orixa looks, what visitors can see, and how you get notified.",
    appearance: "Appearance",
    theme: "Theme",
    themeHint: "Choose how Orixa looks across the entire product.",
    themeSystem: "System",
    themeSystemDesc: "Match your device",
    themeLight: "Light",
    themeLightDesc: "Bright canvas",
    themeDark: "Dark",
    themeDarkDesc: "Ink & Ion (default)",
    languageRegion: "Language & region",
    preferences: "Preferences",
    preferencesHint: "Used for dashboard text and date/time formatting.",
    language: "Language",
    timezone: "Timezone",
    timezoneHint: "Applied across dashboards and dates.",
    privacy: "Privacy",
    visibility: "Visibility",
    publicProfile: "Public profile",
    publicProfileDesc:
      "Let anyone with your link view your profile and published portfolios. Turn this off to hide them from visitors without deleting anything.",
    notifications: "Notifications",
    emailAlerts: "Email alerts",
    emailNotifications: "Email notifications",
    emailNotificationsDesc:
      "Get notified at your account email whenever someone contacts you through a portfolio.",
    saveSettings: "Save settings",
    changesApply: "Changes apply immediately after saving.",
    settingsSaved: "Settings saved.",
    unableToUpdate: "Unable to update settings.",
    email: "Email",
    username: "Username",
    memberSince: "Member since",
    publicUrl: "Public URL",
    viewPublicProfile: "View public profile",
  },

  portfolios: {
    title: "Portfolios",
    subtitle: "Create, edit, and publish your professional portfolios.",
    emptyTitle: "No portfolios yet",
    emptyDesc: "Create your first portfolio and publish it in minutes.",
    statusDraft: "Draft",
    statusPublished: "Published",
    statusArchived: "Archived",
    views: "views",
    version: "Version",
    lastUpdated: "Updated",
  },

  profile: {
    title: "Profile",
    subtitle: "Your global identity across all portfolios.",
    saveProfile: "Save profile",
    profileSaved: "Profile saved.",
  },

  auth: {
    login: "Log in",
    signup: "Sign up",
    email: "Email",
    password: "Password",
    forgotPassword: "Forgot password?",
    noAccount: "Don't have an account?",
    hasAccount: "Already have an account?",
  },
} as const;

type RecursiveString<T> = {
  [K in keyof T]: T[K] extends object ? RecursiveString<T[K]> : string;
};
export type Dictionary = RecursiveString<typeof en>;
export default en;
