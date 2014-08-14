var score = 100;
var dealt = false;
var hand = new Array(8);
var held = new Array(8);
var deck = new Array(53);
function DealDraw() {
  if (dealt == true) Draw();
  else Deal();
}

function Deal() {
//fill the deck (in order, for now)
  for (i=1; i<14; i++) {
    deck[i] = new Card(i, "c");
    deck[i+13] = new Card(i, "h");
    deck[i+26] = new Card(i, "s");
    deck[i+39] = new Card(i, "d");
  }
//shuffle the deck
  var n = Math.floor(400 * Math.random() + 500);
  for (i=1; i<n; i++) {
    card1 = Math.floor(52*Math.random() + 1);
    card2 = Math.floor(52*Math.random() + 1);
    temp = deck[card2];
    deck[card2] = deck[card1];
    deck[card1] = temp;
  }
//Deal and Display cards
  for (i=1; i<8; i++) {
    hand[i] = deck[i];
    document.images[i].src = hand[i].fname();
    document.images[i+7].src = "images/hold.gif";
    held[i] = false;
  }
  dealt = true;
  score = score - 12; //deduct one for the bet amount
  document.form1.total.value = score;
  document.images[15].src="images/draw.gif";
  Addscore();
}

//Hold or discard a card
function Hold(num) {
  if (!dealt) return;
  if (!held[num]) {
    held[num]=true;
    document.images[7+num].src="images/hold2.gif";
  }
  else {
    held[num]=false;
    document.images[7+num].src="images/hold.gif";
  }
}
//Draw new cards
function Draw() {
  var curcard = 8;
  for (i=1; i<8; i++) {
    if (!held[i]) {
    hand[i] = deck[curcard++];
    document.images[i].src = hand[i].fname();
    }
  }
  dealt = false;
  document.images[15].src="images/deal.gif";
  score += Addscore();
  document.form1.total.value = score;
}

function fname() {
  return "images/" + this.num + this.suit + ".gif";
}

function Card(num,suit) {
  this.num = num;
  this.suit = suit;
  this.fname = fname;
}

function Numsort(a,b) { return a - b; }
// Calculate Score
function Addscore() {
  var straight = false;
  var flush = false;
  var pairs = 0;
  var three = false;
  var tally = new Array(14);
//sorted array for convenience
  var nums = new Array(7);
  for (i=0; i<7; i++) {
    nums[i] = hand[i+1].num;
  }
  nums.sort(Numsort);
//flush
  if (hand[1].suit == hand[2].suit &&
      hand[2].suit == hand[3].suit &&
      hand[3].suit == hand[4].suit &&
      hand[4].suit == hand[5].suit &&
      hand[5].suit == hand[6].suit &&
      hand[6].suit == hand[7].suit) flush = true;
//straight (Ace low)
  if (nums[0] == nums[1] -1 &&
      nums[1] == nums[2] -1 &&
      nums[2] == nums[3] -1 &&
      nums[3] == nums[4] -1 &&
      nums[4] == nums[5] -1 &&
      nums[5] == nums[6] -1) straight = true;
//straight (Ace high)
  // if (nums[0] == 1 && nums[1] == 8 && nums[2] == 9 && nums[3] == 10 && nums[4] == 11 && nums[5] == 12 && nums[6] == 13);
  //   straight = true;
//royal flush, straight flush, straight, flush
  if (straight && flush && nums[6] == 15 && nums[0] == 1) {
    document.form1.message.value="Royal Flush";
    return 200;
  }
  if (straight && flush) {
    document.form1.message.value="Straight Flush";
    return 100;
  }
  if (straight) {
    document.form1.message.value="Straight";
    return 50;
  }
  if (flush) {
    document.form1.message.value="Flush";
    return 25;
  }

// tally array is a count for each card value
  for (i=1; i<14; i++) {
    tally[i] = 0;
  }
  for (i=0; i<7; i++) {
    tally[nums[i]] += 1;
  }
  for (i=1; i<14; i++) {
    if (tally[i] == 4) {
      document.form1.message.value = "Four of a Kind";
      return 25;
    }
    if (tally[i] == 3) three = true;
    if (tally[i] == 2) pairs += 1;
  }
  if (three == 2) {
    document.form1.message.value="Really Full House";
    return 30;
  }
  if (pairs == 3) {
    document.form1.message.value="Three Pair";
    return 25
  }
  if (pairs == 2) {
    document.form1.message.value="Two Pair";
    return 10;
  }
  if (three) {
    document.form1.message.value="Three of a Kind";
    return 10;
  }
  if (pairs == 1) {
    if (tally[1] == 2 || tally[11]==2
    || tally[12] == 2 || tally[13]==2) {
      document.form1.message.value="Jacks or Better";
    return 0;
    }

  }
  document.form1.message.value = "No Score";
  return 0;
}
