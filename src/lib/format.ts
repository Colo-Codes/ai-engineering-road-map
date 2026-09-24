export function twoDigits(value: number) {
  return String(value).padStart(2, '0')
}

export function moduleLabel(number: number) {
  return `Module ${twoDigits(number)}`
}

export function lessonLabel(index: number) {
  return `Lesson ${twoDigits(index + 1)}`
}

// "1 chapter", "3 chapters"
export function pluralize(count: number, singular: string, pluralForm = `${singular}s`) {
  return `${count} ${count === 1 ? singular : pluralForm}`
}

export function resourceHost(url: string) {
  try { return new URL(url).hostname.replace(/^www\./, '') }
  catch { return url }
}
