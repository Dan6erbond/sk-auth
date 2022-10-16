export function ucFirst(val: string) {
  return val.charAt(0).toUpperCase() + val.slice(1);
}

export function base64Encode(str: string): string {
  if (typeof btoa === 'undefined') {
    return Buffer.from(str).toString('base64');
  }
  return btoa(str);
} 

export function base64Decode(str: string): string {
  if (typeof atob === 'undefined') {
    return Buffer.from(str, 'base64').toString();
  }
  return atob(str);
} 
