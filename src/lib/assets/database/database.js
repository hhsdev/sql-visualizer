import initSqlJs from 'sql.js';
import { store } from './store.svelte.js';


export const dbInit = async () => {
	const SQL = await initSqlJs({
		locateFile: (file) => `/${file}`
	});
	store.db = new SQL.Database();
};

const isDDL = (command) => {
	const firstWord = command.trim().split(' ')[0].toUpperCase();
	return (
		firstWord === 'CREATE' ||
		firstWord === 'DROP' ||
		firstWord === 'ALTER' ||
		firstWord === 'TRUNCATE'
	);
};

const isDML = (command) => {
	const firstWord = command.trim().split(' ')[0].toUpperCase();
	return (
		firstWord === 'SELECT' ||
		firstWord === 'INSERT' ||
		firstWord === 'UPDATE' ||
		firstWord === 'DELETE'
	);
};

export const dbCommand = (command) => {
	if (isDDL(command)) {
		store.db.run(command);
		store.tableList = fetchTables();
	} else if (isDML(command)) {
		const stmt = store.db.prepare(command);
		const result = [];
		while (stmt.step()) {
			result.push(stmt.get());
		}
		store.selectedTable = {
			headings: stmt.getColumnNames(),
			rows: result
		};
	} else {
		throw new Error(`Unsupported SQL command: ${command}`);
	}
};

export const fetchTables = () => {
	try {
		const results = store.db.exec(
			"SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
		);

		// results[0] is the first (and only) result set
		// row[0] is the 'name' column
		if (results.length > 0) {
			const tableNames = results[0].values.map((row) => row[0]);
			return tableNames;
		}

		return [];
	} catch (err) {
		throw new Error('Failed to fetch tables: ' + err.message);
	}
};

export const getTableSchema = (tableName) => {
	if (!tableName) return [];

	// Run the PRAGMA command
	const res = store.db.exec(`PRAGMA table_info('${tableName}')`);

	if (res.length === 0) return [];

	const columns = res[0].columns; // ['cid', 'name', 'type', 'notnull', 'dflt_value', 'pk']
	const values = res[0].values;

	return {
		headings: columns,
		rows: values
	};
};

const getFromTable = (tableName) => {
	const stmt = store.db.prepare(`SELECT * FROM ${tableName}`);
	const result = [];
	while (stmt.step()) {
		result.push(stmt.get());
	}
	return {
		headings: stmt.getColumnNames(),
		rows: result
	};
};
