// Require the framework and instantiate it
const fastify = require('fastify')({ logger: true });
const KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmdmN0cGNyc3dmcmhpa2ZoZ212Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDU2OTM3MzUsImV4cCI6MTk2MTI2OTczNX0.OL9cXHn9DLplm61cQU5oGm0evNVY896bMaJZCqtsBcU';
const URL = 'https://tfvctpcrswfrhikfhgmv.supabase.co/';
const UAParser = require('ua-parser-js');
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(URL, KEY);

const addOne = async (obj) => {
    return await supabase.from('incidents').insert([obj]);
};

const findOne = async (id) => {
     return  await supabase
        .from('incidents')
        .select('*')
        .eq('id', id);
};

const findAll = async () => {
    return await supabase.from('incidents').select('*');
};

fastify.get('/', async (request, reply) => {
    return await findAll();
});

fastify.get('/:id', async (request, reply) => {
	const { id } = request.params;
    if (typeof Number(id) !=='number') return 'no params found';
    return await findOne(id);
	
});

fastify.post('/', async (request, reply) => {
    const { userAgent, ipInfo, errorInfo, error, url } = request.body;
    const parser = new UAParser();
    parser.setUA(userAgent);
    const { ipAddress, countryName, city } = ipInfo;
    const { browser, os } = parser.getResult();

    try {
       return await addOne({
            ip: ipAddress,
            reactInfo: errorInfo,
            reactError: error,
            url: url,
            browserName: browser.name,
            osName: os.name,
            browserVersion: browser.version,
            userAgent: userAgent,
            country: countryName,
            ipInfo: ipInfo,
            city: city,
        });
    } catch (e) {
        console.log(e);
        return e;
    }
});

// Our standard serverless handler function

// Run the server!
const start = async () => {
    try {
        await fastify.listen(4000);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};
start();
