export function calculateNewElo(userRating, taskRating, userScore, kFactor = 32) {
  const expectedScore = 1 / (1 + Math.pow(10, (taskRating - userRating) / 400));
  const newUserRating = Math.round(userRating + kFactor * (userScore - expectedScore));
  const newTaskRating = Math.round(taskRating + kFactor * ((1 - userScore) - (1 - expectedScore)));
  return { newUserRating, newTaskRating };
}