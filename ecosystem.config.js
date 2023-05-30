module.exports = {
    apps: [
        {
            name: 'donshubackend',
            script: './bin/www',
            instances: 1,
            exec_mode: 'cluster',
            log_date_format: "YYYY-MM-DD HH:mm Z",
            env: {
                NODE_ENV: 'development',
                DB_HOST: "mysqldb",
                DB_NAME: "donshiTest",
                DB_ACCOUNT: "root",
                DB_PASSWORD: "2j/g6ru4cj84",
                CLIENT_SSL_LOCATION: "./.mysql/",
                TOKEN_KEY: "HAuX4yytfQmT8ZsoDTap67n01RnulnGNiuvkKdESZr4U63MaPEtxLwZbK9YFlqE",
                API_KEY: "703e231c-5ad4-4700-823e-9747f1a9d9d1"
            },
            env_production: {
                NODE_ENV: 'production',
                DB_HOST: "mysqldb",
                DB_NAME: "donshiTest",
                DB_ACCOUNT: "root",
                DB_PASSWORD: "2j/g6ru4cj84",
                CLIENT_SSL_LOCATION: "./.mysql/",
                TOKEN_KEY: "HAuX4yytfQmT8ZsoDTap67n01RnulnGNiuvkKdESZr4U63MaPEtxLwZbK9YFlqE",
                API_KEY: "703e231c-5ad4-4700-823e-9747f1a9d9d1"
            }
        }
    ]
};