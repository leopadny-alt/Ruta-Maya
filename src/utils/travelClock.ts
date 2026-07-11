const TEST_DATE_KEY = "ruta-maya-test-date";

export function getAppDate() {
  const savedDate = localStorage.getItem(TEST_DATE_KEY);

  if (!savedDate) {
    return new Date();
  }

  const testDate = new Date(`${savedDate}T12:00:00`);

  if (Number.isNaN(testDate.getTime())) {
    localStorage.removeItem(TEST_DATE_KEY);
    return new Date();
  }

  return testDate;
}

export function getTestDate() {
  return localStorage.getItem(TEST_DATE_KEY) ?? "";
}

export function setTestDate(date: string) {
  if (!date) {
    localStorage.removeItem(TEST_DATE_KEY);
    return;
  }

  localStorage.setItem(TEST_DATE_KEY, date);
}

export function clearTestDate() {
  localStorage.removeItem(TEST_DATE_KEY);
}

export function isTestModeActive() {
  return Boolean(localStorage.getItem(TEST_DATE_KEY));
}