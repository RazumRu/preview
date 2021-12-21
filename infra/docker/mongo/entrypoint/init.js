db.auth("passed_way", "12345678");

db = db.getSiblingDB("passed_way");

db.createUser(
    {
        user: "passed_way",
        pwd: "12345678",
        roles: [
            {
                role: "readWrite",
                db: "passed_way"
            }
        ]
    }
);

db = db.getSiblingDB("passed_way_test");

db.createUser(
    {
        user: "test",
        pwd: "test",
        roles: [
            {
                role: "readWrite",
                db: "passed_way_test"
            }
        ]
    }
);
