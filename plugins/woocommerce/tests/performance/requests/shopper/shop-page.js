/* eslint-disable no-shadow */
/* eslint-disable import/no-unresolved */
/**
 * External dependencies
 */
import { sleep, check, group } from 'k6';
import http from 'k6/http';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.1.0/index.js';

/**
 * Internal dependencies
 */
import { base_url, think_time_min, think_time_max } from '../../config.js';
import {
	htmlRequestHeader,
	commonRequestHeaders,
	commonGetRequestHeaders,
	commonNonStandardHeaders,
} from '../../headers.js';

export function shopPage() {
	let response;

	group( 'Shop Page', function () {
		const requestHeaders = Object.assign(
			{},
			htmlRequestHeader,
			commonRequestHeaders,
			commonGetRequestHeaders,
			commonNonStandardHeaders
		);

		response = http.get( `${ base_url }/shop`, {
			headers: requestHeaders,
			tags: { name: 'Shopper - Shop Page' },
		} );
		check( response, {
			'is status 200': ( r ) => r.status === 200,
			'title equals: Shop – WooCommerce Core E2E Test Suite': (
				response
			) =>
				response.html().find( 'head title' ).text() ===
				'Shop – WooCommerce Core E2E Test Suite',
			'body contains: woocommerce-products-header': ( response ) =>
				response.body.includes(
					'<header class="woocommerce-products-header">'
				),
			'body contains: woocommerce-loop-product__title': ( response ) =>
				response
					.html()
					.find( '.woocommerce-loop-product__title' )
					.toArray().length > 0,
		} );
	} );

	sleep( randomIntBetween( `${ think_time_min }`, `${ think_time_max }` ) );
}

export default function () {
	shopPage();
}
