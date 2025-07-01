/**
 * This file is part of Kino (https://github.com/FCAgreatgoals/kino).
 *
 * Copyright (C) 2025 SAS French Community Agency
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

import util from 'util'
import Sentry from "@sentry/node"

import { LEVELS, COLORS } from './constants'

type KinoInitOptions = Partial<{
	sentry: Sentry.NodeOptions,
	packages: Array<string>,
	ANR: boolean,
	defaultIntanceTitle: string,
	locale: string,
	autoCaptureUnhandledRejections: boolean,
	[extra: string]: any
}>

type SentryCaptureContext = Partial<{
	tags: Record<string, string>
	extras: Record<string, any>,
	user: {
		id: string,
		username: string
	}
}>

/**
 * @class Kino
 * @description A class to standardize the output of logs.
 *
 * @example
 * const logger = new Kino('Module')
 * logger.log('Hello, world!')
 * logger.info('Hello, world!')
 * logger.success('Hello, world!')
 * logger.warn('Hello, world!')
 * logger.error('Hello, world!')
 */
export default class Kino {

	private static instance: Kino;
	private static locale: string = 'en-US';

	public static init(config: KinoInitOptions) {
		if (Kino.instance)
            throw new Error('Logger already initialized');

		if (config.locale)
			this.locale = config.locale;

		this.instance = new Kino(config.defaultIntanceTitle ?? 'GLOBAL');

		if (config.sentry) {
			const integrations = [
				Sentry.functionToStringIntegration(),
				Sentry.linkedErrorsIntegration(),
				Sentry.consoleIntegration({ levels: ['error', 'warn', 'debug', 'trace'] }),
				Sentry.nativeNodeFetchIntegration(),
				Sentry.httpIntegration(),
				Sentry.contextLinesIntegration(),
				Sentry.childProcessIntegration(),
				Sentry.modulesIntegration()
			];

			if (!config.autoCaptureUnhandledRejections)
				integrations.push(Sentry.onUncaughtExceptionIntegration(), Sentry.onUnhandledRejectionIntegration())
			
			if (config.ANR)
				integrations.push(Sentry.anrIntegration({ captureStackTrace: true }))

			if (config.packages?.includes('knex'))
				integrations.push(Sentry.knexIntegration())
			
			if (config.packages?.includes('mysql2'))
				integrations.push(Sentry.mysql2Integration())

			Sentry.init({
				tracesSampleRate: config.sentry.tracesSampleRate ?? 0.1,
				...(!config.sentry.defaultIntegrations ? { defaultIntegrations: false } : {}),
				integrations,
				maxBreadcrumbs: config.sentry.maxBreadcrumbs ?? 5,
				sendClientReports: false,
				...config.sentry
			});
		}

		if (config.autoCaptureUnhandledRejections) {
			process.on('unhandledRejection', (reason: any) => {
				Kino.error(reason)
			})

			process.on('uncaughtException', async (error: Error) => {
				Kino.error(error)
			})
		}
	}

	private readonly module: string

	/**
	 * @constructor Logger
	 * @param module The label to display in each log line, usually the module name.
	 */
	constructor(module: string) {
		this.module = module;
	}

	/**
	 * @private
	 * @method formatDate
	 * @description Formats the current date and time for log entries.
	 * @returns A string with the formatted date.
	 */
	private static formatDate(): string {
		return new Date().toLocaleString(this.locale, {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit'
		});
	}

	/**
	 * @private
	 * @method output
	 * @description Outputs the formatted log to the console.
	 * @param type The log level ('log', 'info', 'success', 'warn', 'error').
	 * @param entries The content to print.
	 */
	private output(type: keyof typeof LEVELS, ...entries: Array<any>): void {
		const color = COLORS[type];
		const level = LEVELS[type];
		const prefix = color(`[${Kino.formatDate()} - ${this.module} - ${level}]`);

		const writer =
			type === 'error' ? console.error :
			type === 'warn' ? console.warn :
			type === 'info' ? console.info :
			type === 'debug' ? console.debug :
			console.log

		for (const entry of entries)
			writer(prefix, typeof entry === 'string' ? entry : util.inspect(entry, { depth: 3, colors: true }));
	}

	/**
	 * @method log
	 * @description Logs data with 'log' level.
	 * @param entries The content to log.
	 */
	public log(...entries: Array<any>): void {
		if (!Kino.instance)
            throw new Error('Logger not initialized');

		this.output('log', ...entries);
	}

	public static log(...entries: any[]): void {
		this.instance.log(...entries);
	}

	/**
	 * @method info
	 * @description Logs data with 'info' level.
	 * @param entries The content to log.
	 */
	public info(...entries: Array<any>): void {
		if (!Kino.instance)
            throw new Error('Logger not initialized');

		this.output('info', ...entries);
	}

	public static info(...entries: any[]): void {
		if (!Kino.instance)
            throw new Error('Logger not initialized');

		this.instance.info(...entries);
	}

	/**
	 * @method debug
	 * @description Logs data with 'debug' level.
	 * @param entries The content to log.
	 */
	public debug(...entries: Array<any>): void {
		if (!Kino.instance)
            throw new Error('Logger not initialized');

		this.output('debug', ...entries);
	}

	public static debug(...entries: any[]): void {
		if (!Kino.instance)
            throw new Error('Logger not initialized');

		this.instance.debug(...entries);
	}

	/**
	 * @method success
	 * @description Logs data with 'success' level.
	 * @param entries The content to log.
	 */
	public success(...entries: Array<any>): void {
		if (!Kino.instance)
            throw new Error('Logger not initialized');

		this.output('success', ...entries);
	}

	
	public static success(...entries: any[]): void {
		if (!Kino.instance)
            throw new Error('Logger not initialized');

		this.instance.success(...entries);
	}

	/**
	 * @method warn
	 * @description Logs data with 'warn' level.
	 * @param entries The content to log.
	 */
	public warn(...entries: Array<any>): void {
		if (!Kino.instance)
            throw new Error('Logger not initialized');

		this.output('warn', ...entries);
	}

	public static warn(...entries: any[]): void {
		if (!Kino.instance)
            throw new Error('Logger not initialized');

		this.instance.warn(...entries);
	}

	/**
	 * @method error
	 * @description Logs data with 'error' level.
	 * @param entries The content to log.
	 */
	public error(error: unknown, context?: SentryCaptureContext): void {
		if (!Kino.instance)
            throw new Error('Logger not initialized');

		this.output('error', error);

		if (Sentry.getClient())
			Sentry.captureException(error, {
				...context,
				tags: {
					...context?.tags,
					module: this.module
				}
			})
			
	}

	public static error(error: unknown, context?: SentryCaptureContext): void {
		if (!Kino.instance)
            throw new Error('Logger not initialized');

		this.instance.error(error, context);
	}

	/**
	 * @method trace
	 * @description Returns a function to trace/log a specific error with context (UID).
	 * Typically used inside a catch block.
	 *
	 * @param uid A unique identifier for tracing.
	 * @returns A function to pass to `.catch()`.
	 */
	public trace(uid: string, context?: SentryCaptureContext): (err: unknown) => void {
		if (!Kino.instance)
            throw new Error('Logger not initialized');

		return (err: unknown) => {
			const fullContext: SentryCaptureContext = {
				...context,
				tags: {
					...context?.tags,
					trace_uid: uid
				}
			}

			this.error(err, fullContext)
		}
	}

	public static trace(uid: string): (...entries: any[]) => void {
		if (!Kino.instance)
            throw new Error('Logger not initialized');

		return this.instance.trace(uid);
	}

	public static get Sentry() {
		return Sentry
	}

	public static get withIsolationScope() {
		return Sentry.withIsolationScope
	}
}
