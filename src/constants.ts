/**
 * This file is part of @fca.gg/kino (https://github.com/FCAgreatgoals/kino).
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

import chalk from 'chalk'

export const LEVELS = {
	log: 'LOG',
	info: 'INFO',
	success: 'SUCCESS',
	warn: 'WARN',
	error: 'ERROR',
	debug: 'DEBUG'
}

export const COLORS = {
	log: chalk.cyan,
	info: chalk.white,
	success: chalk.green,
	warn: chalk.yellow,
	error: chalk.red,
	debug: chalk.blueBright
}