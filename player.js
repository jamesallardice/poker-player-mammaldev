var unirest = require('unirest');

var ranks = [ 'A', 'K', 'Q', 'J', '10' ];

function isAK( card ) {
  return card.rank === 'A' || card.rank === 'K';
}

function shouldPlay( card1, card2 ) {

  if ( ranks.indexOf(card1.rank) > -1 && ranks.indexOf(card2.rank) > -1 ) {
    return true;
  }

  if ( card1.rank === card2.rank ) {
    return true;
  }

  if ( card1.suit === card2.suit ) {
    if ( isAK(card1) || isAK(card2) ) {
      return true;
    }
  }

  return false;
}

function isPreFlop( state ) {
  return !state.community_cards || state.community_cards.length === 0;
}

module.exports = {

  VERSION: "Default JavaScript folding player",

  bet_request: function(game_state, bet) {

    var myIndex = game_state.in_action;
    var me = game_state.players[ myIndex ];

    // Very basic initial play... all-in pre-flop for any 2 cards of any suit
    // in the above array.
    if ( 
      isPreFlop(game_state) && 
      shouldPlay(me.hole_cards[ 0 ], me.hole_cards[ 1 ])
    ) {
      return bet(me.stack);
    }

    bet(0);

    // // Try some all-ins with ace-high.
    // if ( me.hole_cards[ 0 ].rank === 'A' || me.hole_cards[ 1 ] === 'A' ) {
    //   return bet(me.stack);
    // }

    // // Bet a bit less for suited cards.
    // if (
    //   game_state.round === 0 &&
    //   me.hole_cards[ 0 ].suit === me.hole_cards[ 1 ].suit //&&
    //   // suitedRanks.indexOf(me.hole_cards[ 0 ].rank) > -1 &&
    //   // suitedRanks.indexOf(me.hole_cards[ 1 ].rank) > -1
    // ) {
    //   return bet(me.stack / 10);
    // }

    // // If we are through to the flop...
    // if ( game_state.round > 0 && game_state.community_cards ) {
    //   var cards = me.hole_cards.concat(game_state.community_cards);
    //   unirest.get('http://rainman.leanpoker.org/rank')
    //   .field('cards', JSON.stringify(cards))
    //   .end(function ( res ) {

    //     var result;
    //     try {
    //       result = JSON.parse(res.body);
    //     } catch ( e ) {

    //       // Something went wrong... check or fold.
    //       return bet(0);
    //     }

    //     // Hit something... (at least 2 pair).
    //     if ( result.rank > 1 ) {
    //       return bet(me.stack);
    //     } 

    //     // Flop flush-draw.
    //     if ( game_state.round === 1 ) {
    //       if ( 
    //         me.hole_cards[ 0 ].suit === me.hole_cards[ 1 ].suit &&
    //         game_state.community_cards.filter(function ( card ) {
    //           return card.suit === me.hole_cards[ 0 ].suit;
    //         }).length > 1
    //       ) {
    //         return bet(me.stack);
    //       }
    //     }

    //     // Got nothing, fold/check.
    //     return bet(0);
    //   })
    // } else {

      // Otherwise fold.
      // bet(0);
    // }

  },

  showdown: function(game_state) {

  }
};
