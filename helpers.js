export function substring(str, start, end) {
  return str.substring(start, end);
}

export async function getCommentsData() {
  try {
    const response = await fetch('/api/comments');
    if (!response.ok) {
      throw new Error('Failed to fetch comments data.');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching comments data:', error);
    return [];
  }
}

export function isEqual(obj1, obj2) {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}

export function getUpvoteStatus(upvoteStatusArray, index) {
  return upvoteStatusArray[index].upvoteStatus;
};

export function getDownvoteStatus(downvoteStatusArray, index) {
  return downvoteStatusArray[index].downvoteStatus;
};

export function getSaveStatus(saveStatusArray, index) {
  return saveStatusArray[index].saveStatus;
};