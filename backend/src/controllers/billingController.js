// backend/controllers/billingController.js

/**
 * Salva l'indirizzo di fatturazione nella transazione corrente
 * @param {number} orderId - ID ordine appena creato
 * @param {Object} billingData - Dati dal frontend
 * @param {Object} connection - Connessione DB attiva (in transazione)
 * @param {Function} callback - (err, billingId)
 */
const saveBillingAddress = function(orderId, billingData, connection, callback) {
  // Validazione base
  if (!billingData || !billingData.name || !billingData.address || !billingData.city || !billingData.zip || !billingData.country) {
    return callback(new Error('Missing required billing fields'));
  }

  const query = `
    INSERT INTO billing_addresses 
    (order_id, full_name, address_line, city, zip_code, country_code, vat_number)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    orderId,
    billingData.name.trim(),
    billingData.address.trim(),
    billingData.city.trim(),
    billingData.zip.trim(),
    billingData.country.toUpperCase().trim(),
    billingData.vat ? billingData.vat.trim() : null
  ];

  // Esegue la query sulla stessa connection della transazione
  connection.query(query, values, function(err, result) {
    if (err) return callback(err);
    callback(null, result.insertId);
  });
};

module.exports = { saveBillingAddress };