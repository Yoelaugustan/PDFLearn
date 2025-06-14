export function cleanTextForPostgres(input: string): string {
    let s = input.normalize('NFC')
    s = s.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    s = s.replace(/[\uD800-\uDFFF]/g, '')
    return s
}