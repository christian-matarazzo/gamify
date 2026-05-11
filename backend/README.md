# DIPENDENZE BACKEND NPM FIN ORA:

express
mysql2
cors
nodemailer



# TODO LIST:

Da implementare una endpoint che valida il coupon prima dell'acquisto, così da poterla richiamare in front end tramite POST, su un pulsante aggiungi coupon, e usare i dati per il calcolo del prezzo.
La logica è in parte già implementata nell'endpoint purchase in ordersController.js

Da modificare endpoint purchase per fare in modo che faccia un controllo finale sul checkout in modo tale da avere la sicurezza che se le chiavi restanti siano 1, e un utente compra l'ultima mentre qualcuno sta effettuando l'acquisto, 
venga bloccato l'acquisto per mancanze di chiavi. 


# FAQ ROTTE:


api/inventory (GET - restituisce un item tramite quary con tutto il db come oggetto per poter estrarre il numero di chiavi rimase)
api/games (GET - restituisce tutto il db per essere mappato)
api/games/:slug (GET - restituisce lo slug del singolo elemento per una pagina di dettagli)
api/orders/purchase (POST - effettua l'acquisto finale dopo aver calcolato e controllato tutto l'ordine. Il body è composto da: {"email": "test@example.com", "game_id": 1, "coupon": "WELCOME10"} )
/api/newsletter/subscribe (POST - effettua la sub di una email per la newsletter. Il body è composto da: {"email: "test@example.com","confirmation_sent": 1} )

