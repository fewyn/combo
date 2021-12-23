import { cliExecute, fileToBuffer, gamedayToInt, myId } from "kolmafia";
import { get, set } from "libram";

type BeachTile = { minute: number; row: number; column: number };

const rareTiles: BeachTile[] = JSON.parse(fileToBuffer("raretiles.json"));

function _comb(tile: BeachTile): void {
  const { minute, row, column } = tile;
  cliExecute(`beach wander ${minute}; beach comb ${row} ${column}`);
}

let seed = parseInt(myId());
function deterministicRandom(): number {
  seed++;
  return Math.sin(seed);
}

function deterministicShuffle<T>(array: T[]): T[] {
  const returnValue: T[] = [];
  while (array.length > 0) {
    const index = Math.floor(deterministicRandom() * array.length);
    returnValue.push(...array.splice(index));
  }
  return returnValue;
}

let shuffledArray: BeachTile[];

function getShuffledArray(): BeachTile[] {
  if (!shuffledArray) {
    shuffledArray = deterministicShuffle(rareTiles);
  }
  return shuffledArray;
}

function comb(): void {
  const tileList = getShuffledArray();
  const index = (get("combo_lastTileCombed", 0) + 1) % tileList.length;
  const tile = tileList[index];
  const dayOfMonth = 1 + (gamedayToInt() % 8);
  const rowsHidden = 4 - Math.abs(4 - dayOfMonth);
  const shouldComb = tile.row > rowsHidden;
  if (shouldComb) _comb(tile);
  set("combo_lastTileCombed", index);
  return;
}