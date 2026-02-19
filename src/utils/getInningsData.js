export function getInnings(scorecard) {

  if (!scorecard?.scorecard) return [];

  return scorecard.scorecard.map((inning, index) => {

    return {
      title: index === 0 ? "1st Innings" : "2nd Innings",
      batting: inning.batting || [],
      bowling: inning.bowling || []
    };

  });

}
