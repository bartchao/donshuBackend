module.exports = (err,res) =>{ 
    let { message } = err;
	if(err.code == "ENOENT")message="no such file or directory";
    let code = (message === "Forbbiden") ? 403 : 500;
    console.error('%s'.error,err);
    console.error(err);
    res.status(code).send({Error:message});
}