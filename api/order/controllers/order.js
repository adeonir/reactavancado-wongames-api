'use strict';

const { sanitizeEntity } = require('strapi-utils/lib');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = {
  create: async (ctx) => {
    const { cart, paymentIntentId, paymentMethod } = ctx.request.body;

    const gamesIds = await strapi.config.functions.cart.getGamesIds(cart);
    const games = await strapi.config.functions.cart.getCartItems(gamesIds);
    const total_in_cents = await strapi.config.functions.cart.getTotal(games);

    let paymentInfo;
    if (total_in_cents !== 0) {
      try {
        paymentInfo = await stripe.paymentMethods.retrieve(paymentMethod);
      } catch (error) {
        ctx.response.status = 402;
        return { error: error.message };
      }
    }

    const token = await strapi.plugins[
      'users-permissions'
    ].services.jwt.getToken(ctx);

    const userId = token.id;
    const user = await strapi
      .query('user', 'users-permissions')
      .findOne({ id: userId });

    const entry = {
      total_in_cents,
      payment_intent_id: paymentIntentId,
      payment_method: paymentMethod,
      card_brand: paymentInfo?.card?.brand,
      last4: paymentInfo?.card?.last4,
      games,
      user,
    };

    const entity = await strapi.services.order.create(entry);

    return sanitizeEntity(entity, { model: strapi.models.order });
  },
  createPaymentIntent: async (ctx) => {
    const { cart } = ctx.request.body;

    const gamesIds = await strapi.config.functions.cart.getGamesIds(cart);
    const games = await strapi.config.functions.cart.getCartItems(gamesIds);
    const total = await strapi.config.functions.cart.getTotal(games);

    if (!games.length) {
      ctx.response.status = 404;

      return {
        error: 'No valid games found',
      };
    }

    if (total === 0) {
      return {
        freeGames: true,
      };
    }

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: total,
        currency: 'usd',
        payment_method_types: ['card'],
        metadata: {
          cart: JSON.stringify(gamesIds),
        },
      });

      return paymentIntent;
    } catch (error) {
      return {
        error: error.raw.message,
      };
    }
  },
};
