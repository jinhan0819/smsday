PM2 json 만들때 내용

{
    "apps": [
        {
            "name": "node_sample_project",
            "script": "bin/dev",
            "watch": false,
            "env": {
                "NODE_ENV": "production",
                "PORT": 3800
            },
            "exec_mode": "cluster",
            "instances": 1,
			"error_file" : "node_logs/err.log",
			"out_file" : "node_logs/out.log",
			"log_date_format" : "YYYY_MM_DD HH:mm Z",
			"combine_logs" : true
        }
    ]
}
