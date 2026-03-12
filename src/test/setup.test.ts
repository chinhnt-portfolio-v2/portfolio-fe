// Smoke test — verifies test environment is configured correctly
describe('Test environment', () => {
  it('should have jsdom globals available', () => {
    expect(typeof document).toBe('object')
    expect(typeof window).toBe('object')
  })
})
