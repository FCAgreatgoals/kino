/**
 * This file is part of Kino (https://github.com/FCAgreatgoals/kino).
 *
 * Copyright (C) 2026 SAS French Community Agency
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
 *
 * Additional permission under the AGPL-3.0 section 7:
 * You may use this library as a dependency in your own application without
 * your application being subject to the AGPL-3.0. Only modifications to
 * Kino itself must be made publicly available. See LINKING_EXCEPTION.md
 * for full details.
 */

import Kino from './Kino';

export default class KinoLoggedClass {
	private static _logger?: Kino

	protected static get logger(): Kino {
		if (!this._logger) {
			this._logger = new Kino(this.name)
		}

		return this._logger
	}

	protected get logger(): Kino {
		if (!(this.constructor as typeof KinoLoggedClass)._logger) {
			(this.constructor as typeof KinoLoggedClass)._logger = new Kino(this.constructor.name)
		}

		return (this.constructor as typeof KinoLoggedClass)._logger as Kino
	}
}