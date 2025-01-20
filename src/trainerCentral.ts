// src/trainerCentral.ts

export async function fetchUserData(userId: string, authToken: string) {
  const response = await fetch(`https://api.trainercentral.com/v1/users/${userId}`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch user data: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function fetchCourseEnrollments(userId: string, authToken: string) {
  const response = await fetch(`https://api.trainercentral.com/v1/users/${userId}/courses`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch course enrollments: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

// ... add further utility functions for lessons, tests, etc.
