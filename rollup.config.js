export default {
	input: 'src/app.js',
	name: 'frankenApp',
	output: [
		{file: 'dist/franken-app.cjs.js', format: 'cjs'},
		{file: 'dist/franken-app.js', format: 'es'},
		{file: 'dist/franken-app.umd.js', format: 'umd'}
	]
};
