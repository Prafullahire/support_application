const LOGIN_PHOTO_KEY = 'officeBoyLoginPhoto';
const LOGIN_PHOTO_TIME_KEY = 'officeBoyLoginPhotoAt';
const CHECK_IN_PHOTO_KEY = 'officeBoyCheckInPhoto';
const CHECK_IN_PHOTO_TIME_KEY = 'officeBoyCheckInPhotoAt';
const CHECK_OUT_PHOTO_KEY = 'officeBoyCheckOutPhoto';
const CHECK_OUT_PHOTO_TIME_KEY = 'officeBoyCheckOutPhotoAt';

export interface OfficeBoyStoredPhoto {
  dataUrl: string;
  capturedAt: string;
}

function readPhoto(dataKey: string, timeKey: string): OfficeBoyStoredPhoto | null {
  if (typeof window === 'undefined') return null;
  const dataUrl = sessionStorage.getItem(dataKey);
  const capturedAt = sessionStorage.getItem(timeKey);
  if (!dataUrl || !capturedAt) return null;
  return { dataUrl, capturedAt };
}

function writePhoto(dataKey: string, timeKey: string, dataUrl: string) {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(dataKey, dataUrl);
  sessionStorage.setItem(timeKey, new Date().toISOString());
}

function clearPhoto(dataKey: string, timeKey: string) {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(dataKey);
  sessionStorage.removeItem(timeKey);
}

export function saveOfficeBoyLoginPhoto(dataUrl: string) {
  writePhoto(LOGIN_PHOTO_KEY, LOGIN_PHOTO_TIME_KEY, dataUrl);
}

export function getOfficeBoyLoginPhoto(): OfficeBoyStoredPhoto | null {
  return readPhoto(LOGIN_PHOTO_KEY, LOGIN_PHOTO_TIME_KEY);
}

export function saveOfficeBoyCheckInPhoto(dataUrl: string) {
  writePhoto(CHECK_IN_PHOTO_KEY, CHECK_IN_PHOTO_TIME_KEY, dataUrl);
}

export function getOfficeBoyCheckInPhoto(): OfficeBoyStoredPhoto | null {
  return readPhoto(CHECK_IN_PHOTO_KEY, CHECK_IN_PHOTO_TIME_KEY);
}

export function saveOfficeBoyCheckOutPhoto(dataUrl: string) {
  writePhoto(CHECK_OUT_PHOTO_KEY, CHECK_OUT_PHOTO_TIME_KEY, dataUrl);
}

export function getOfficeBoyCheckOutPhoto(): OfficeBoyStoredPhoto | null {
  return readPhoto(CHECK_OUT_PHOTO_KEY, CHECK_OUT_PHOTO_TIME_KEY);
}

export function getOfficeBoyDisplayPhoto(): OfficeBoyStoredPhoto | null {
  return getOfficeBoyCheckInPhoto() ?? getOfficeBoyLoginPhoto();
}

export function clearOfficeBoyLoginPhoto() {
  clearPhoto(LOGIN_PHOTO_KEY, LOGIN_PHOTO_TIME_KEY);
}

export function clearOfficeBoyAttendancePhotos() {
  clearPhoto(CHECK_IN_PHOTO_KEY, CHECK_IN_PHOTO_TIME_KEY);
  clearPhoto(CHECK_OUT_PHOTO_KEY, CHECK_OUT_PHOTO_TIME_KEY);
}

export function clearAllOfficeBoyPhotos() {
  clearOfficeBoyLoginPhoto();
  clearOfficeBoyAttendancePhotos();
}

export function hasOfficeBoyLoginPhoto(): boolean {
  return !!getOfficeBoyLoginPhoto();
}
