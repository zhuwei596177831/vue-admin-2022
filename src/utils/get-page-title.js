import defaultSettings from '@/settings'

// const title = defaultSettings.title || 'Vue Admin Template'
const title = process.env.VUE_APP_TITLE;

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
