const solc = require('solc');
const fs = require('fs');
const path = require('path');

const contractsDir = path.resolve(__dirname + '/../contracts');
let files = fs.readdirSync(contractsDir).filter((item) => item.endsWith('.sol'));

let sources = {};
for (let i = 0; i < files.length; i++)
{
	let file = files[i];
	let filePath = path.resolve(contractsDir, file);
	let contents = fs.readFileSync(filePath);

	sources[file] = {
		content: contents.toString()
	}
}

// https://docs.soliditylang.org/en/v0.5.0/using-the-compiler.html#compiler-input-and-output-json-description

let settings = {
	outputSelection: {
		'*': {
			'*': [ '*' ]
		}
	}
};

let input = {
	language: 'Solidity',
	sources: sources,
	settings: settings
};

let processedInput = JSON.stringify(input);

let compiledJson = solc.compile(processedInput);

let output = JSON.parse(compiledJson);

console.log(output.contracts);

let compileDir = path.resolve(__dirname + '/../build');
for (let id in output.contracts)
{
	let contract = output.contracts[id];
	for (let contractName in contract)
	{
		let filePath = path.resolve(compileDir, `${contractName}.json`);
		let jsonContent = JSON.stringify(contract[contractName]);
		fs.writeFileSync(filePath, jsonContent);
	}
}