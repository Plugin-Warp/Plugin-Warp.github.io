// Name: String Joiner
// ID: stringJoiner
// Description: Expanson of the join()() block.
// By: -Clickertale_2- <https://scratch.mit.edu/users/-Clickertale_2-/>
// License: MIT AND MPL-2.0

  class StringJoinerExtension {
	constructor() {
	  this.showAdvancedBlocks = 0;
	}

	getInfo() {
	  const blocks = [];
	  for (let i = 1; i <= 10; i++) {
		const args = {};
		for (let j = 1; j <= i; j++) {
		  args[`STR${j}`] = { 
			type: Scratch.ArgumentType.STRING, 
			defaultValue: j === 1 ? `${i}` : ''
		  };
		}
		blocks.push({
		  opcode: `join${i}Strings`,
		  blockType: Scratch.BlockType.REPORTER,
		  text: `join ${Array.from({ length: i }, (_, k) => `[STR${k + 1}]`).join(' ')}`,
		  arguments: args
		});
	  }

	  blocks.push({
		blockType: Scratch.BlockType.BUTTON,
		func: 'toggleAdvancedBlocks',
		text: this.showAdvancedBlocks === 0 
		  ? 'Show Join blocks 11 to 50?' 
		  : 'Hide Join blocks 11 to 50?'
	  });

	  for (let i = 11; i <= 50; i++) {
		const args = {};
		for (let j = 1; j <= i; j++) {
		  args[`STR${j}`] = { 
			type: Scratch.ArgumentType.STRING, 
			defaultValue: j === 1 ? `${i}` : ''
		  };
		}
		blocks.push({
		  opcode: `join${i}Strings`,
		  blockType: Scratch.BlockType.REPORTER,
		  text: `join ${Array.from({ length: i }, (_, k) => `[STR${k + 1}]`).join(' ')}`,
		  arguments: args,
		  hideFromPalette: this.showAdvancedBlocks === 0
		});
	  }

	  return {
		id: 'stringJoiner',
		name: 'String Joiner',
		color1: '#4CAF50',
		color2: '#57C95C',
		color3: '#39873C',
		blocks: blocks
	  };
	}

	_generateJoinFunction(strCount) {
	  return (args) => {
		let result = '';
		for (let i = 1; i <= strCount; i++) {
		  result += Scratch.Cast.toString(args[`STR${i}`]);
		}
		return result;
	  };
	}

	toggleAdvancedBlocks() {
	  this.showAdvancedBlocks = this.showAdvancedBlocks === 0 ? 1 : 0;
	  Scratch.vm.extensionManager.refreshBlocks();
	}
  }

  for (let i = 1; i <= 50; i++) {
	StringJoinerExtension.prototype[`join${i}Strings`] = new StringJoinerExtension()._generateJoinFunction(i);
  }

  Scratch.extensions.register(new StringJoinerExtension());