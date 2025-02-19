export function handleApiError(error: unknown) {
  const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred"
  return {
    error: errorMessage,
    status: 500,
  }
}

