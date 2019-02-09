module.exports = {
	runtimeCaching: [
		{
			urlPattern: /\/api\//,
			handler: 'networkFirst',
		}, {
			urlPattern: /\/joinus\//,
			handler: 'networkFirst',
		},
	],
};