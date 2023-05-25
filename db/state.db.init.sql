BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "Game" (
  "index" INTEGER,
  "board_width" INTEGER NOT NULL,
  "board_height" INTEGER NOT NULL,
  "board_seed" TEXT NOT NULL,
  "roll_seed" TEXT NOT NULL,
  "roll_count" INTEGER NOT NULL,
  "winner" INTEGER,
  PRIMARY KEY("index")
);
CREATE TABLE IF NOT EXISTS "Player" (
  "index" INTEGER,
  "name" INTEGER NOT NULL,
  "colour" INTEGER NOT NULL,
  "user" INTEGER NOT NULL,
  PRIMARY KEY("index")
);
CREATE TABLE IF NOT EXISTS "User" (
  "index" INTEGER,
  PRIMARY KEY("index")
);
CREATE TABLE IF NOT EXISTS "GamePlayer" (
  "index" INTEGER,
  "gameIndex" INTEGER NOT NULL,
  "playerIndex" INTEGER,
  PRIMARY KEY("index"),
  FOREIGN KEY("gameIndex") REFERENCES "Game"("index"),
  FOREIGN KEY("playerIndex") REFERENCES "Player"("index")
);
COMMIT;
