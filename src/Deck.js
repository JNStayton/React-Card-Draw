import { useState, useEffect, useRef } from 'react';
import Card from './Card';
import axios from 'axios';

const Deck = () => {
	const [ deck, setDeck ] = useState(null);
	const [ cardImg, setCardImg ] = useState(null);
	const [ card, setCard ] = useState(null);
	const [ autoDraw, setAutoDraw ] = useState(false);
	const timerId = useRef();
	//set the deck (get a new deck)
	useEffect(
		() => {
			async function getDeck() {
				let res = await axios.get('http://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
				setDeck(res.data.deck_id);
			}
			getDeck();
		},
		[ setDeck ]
	);

	//draw a card from the deck with 1 second timer
	useEffect(
		() => {
			async function drawCard() {
				let res = await axios.get(`http://deckofcardsapi.com/api/deck/${deck}/draw/`);
				try {
					setCardImg(res.data.cards[0].image);
					setCard(`${res.data.cards[0].value} of ${res.data.cards[0].suit}`);
				} catch (err) {
					alert('All out of cards!');
					setAutoDraw(false);
				}
			}
			if (autoDraw && !timerId.current) {
				timerId.current = setInterval(async () => {
					await drawCard();
				}, 1000);
			}

			return () => {
				clearInterval(timerId.current);
				timerId.current = null;
			};
		},
		[ setCardImg, setCard, autoDraw, deck, setAutoDraw, timerId ]
	);

	//toggles true/false for autoDraw, determines whether or not cards are drawn
	const toggleAutoDrawCards = () => {
		setAutoDraw((autoDraw) => !autoDraw);
	};

	const currentCard = <Card img={cardImg} name={card} />;

	return (
		<div className="Deck">
			<button onClick={toggleAutoDrawCards}>{!autoDraw ? 'DRAW' : 'STOP'}</button>
			<div>{currentCard ? currentCard : null}</div>
		</div>
	);
};

export default Deck;
