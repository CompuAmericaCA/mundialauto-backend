const sql = require('mssql');
const config = {
    user: process.env.USER_BD,
    password: process.env.PASSWORD_BD,
    server: process.env.SERVER_BD,
    database: process.env.NAME_BD,
}

module.exports = { 
    validateModulePermissionQuery: async(validationData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cusuario', sql.Int, validationData.cusuario)
                .input('cmodulo', sql.Int, validationData.cmodulo)
                .query('select * from VWPERMISOSXUSUARIO where CUSUARIO = @cusuario and CMODULO = @cmodulo');
            //sql.close();
            return { result: result }; 
        }catch(err){
            return { error: err.message };
        }
    },
    validateApiModulePermissionQuery: async(validationData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cconsumidor', sql.Int, validationData.cconsumidor)
                .input('cmodulo', sql.Int, validationData.cmodulo)
                .query('select * from APPERMISOCONSUMIDOR where CCONSUMIDOR = @cconsumidor and CMODULO = @cmodulo');
            //sql.close();
            return { result: result }; 
        }catch(err){
            return { error: err.message };
        }
    },
    searchConsumerQuery: async(searchData) => {
        try{
            let query = `select * from APCONSUMIDOR where CCONSUMIDOR != 0${ searchData.cpais ? ' and CPAIS = @cpais' : '' }${ searchData.ccompania ? ' and CCOMPANIA = @ccompania' : '' }${ searchData.xconsumidor ? ' and XCONSUMIDOR = @xconsumidor' : '' }${ searchData.xproducto ? ' and XPRODUCTO = @xproducto' : '' }`;
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cpais', sql.Numeric(4, 0), searchData.cpais ? searchData.cpais : 1)
                .input('ccompania', sql.Int, searchData.ccompania ? searchData.ccompania : 1)
                .input('xconsumidor', sql.NVarChar, searchData.xconsumidor ? searchData.xconsumidor : null)
                .input('xproducto', sql.NVarChar, searchData.xproducto ? searchData.xproducto : null)
                .query(query);
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    verifyConsumerProductToCreateQuery: async(xproducto) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('xproducto', sql.NVarChar, xproducto)
                .query('select * from APCONSUMIDOR where XPRODUCTO = @xproducto');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    verifyConsumerUserToCreateQuery: async(xusuario) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('xusuario', sql.NVarChar, xusuario)
                .query('select * from APCONSUMIDOR where XUSUARIO = @xusuario');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    createConsumerQuery: async(consumerData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('xconsumidor', sql.NVarChar, consumerData.xconsumidor)
                .input('xproducto', sql.NVarChar, consumerData.xproducto)
                .input('xemail', sql.NVarChar, consumerData.xemail)
                .input('xusuario', sql.NVarChar, consumerData.xusuario)
                .input('xcontrasena', sql.NVarChar, consumerData.xcontrasena)
                .input('bactivo', sql.Bit, consumerData.bactivo)
                .input('cpais', sql.Numeric(4, 0), consumerData.cpais)
                .input('ccompania', sql.Int, consumerData.ccompania)
                .input('cusuariocreacion', sql.Int, consumerData.cusuariocreacion)
                .input('fcreacion', sql.DateTime, new Date())
                .query('insert into APCONSUMIDOR (XCONSUMIDOR, XPRODUCTO, XEMAIL, XUSUARIO, XCONTRASENA, BACTIVO, CPAIS, CCOMPANIA, CUSUARIOCREACION, FCREACION) output inserted.CCONSUMIDOR values (@xconsumidor, @xproducto, @xemail, @xusuario, @xcontrasena, @bactivo, @cpais, @ccompania, @cusuariocreacion, @fcreacion)');
                if(result.rowsAffected > 0 && consumerData.permissions){
                    for(let i = 0; i < consumerData.permissions.length; i++){
                        let insert = await pool.request()
                            .input('cconsumidor', sql.Int, result.recordset[0].CCONSUMIDOR)
                            .input('cgrupo', sql.Int, consumerData.permissions[i].cgrupo)
                            .input('cmodulo', sql.Int, consumerData.permissions[i].cmodulo)
                            .input('bindice', sql.Bit, consumerData.permissions[i].bindice)
                            .input('bcrear', sql.Bit, consumerData.permissions[i].bcrear)
                            .input('bdetalle', sql.Bit, consumerData.permissions[i].bdetalle)
                            .input('beditar', sql.Bit, consumerData.permissions[i].beditar)
                            .input('beliminar', sql.Bit, consumerData.permissions[i].beliminar)
                            .input('cusuariocreacion', sql.Int, consumerData.cusuariocreacion)
                            .input('fcreacion', sql.DateTime, new Date())
                            .query('insert into APPERMISOCONSUMIDOR (CCONSUMIDOR, CGRUPO, CMODULO, BINDICE, BCREAR, BDETALLE, BEDITAR, BELIMINAR, CUSUARIOCREACION, FCREACION) values (@cconsumidor, @cgrupo, @cmodulo, @bindice, @bcrear, @bdetalle, @beditar, @beliminar, @cusuariocreacion, @fcreacion)')
                    }
                }
                //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    getConsumerDataQuery: async(cconsumidor) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cconsumidor', sql.Int, cconsumidor)
                .query('select * from APCONSUMIDOR where CCONSUMIDOR = @cconsumidor');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    getConsumerPermissionsDataQuery: async(cconsumidor) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cconsumidor', sql.Int, cconsumidor)
                .query('select * from VWBUSCARPERMISOSXCONSUMIDORDATA where CCONSUMIDOR = @cconsumidor');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    verifyConsumerProductToUpdateQuery: async(cconsumidor, xproducto) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('xproducto', sql.NVarChar, xproducto)
                .input('cconsumidor', sql.Int, cconsumidor)
                .query('select * from APCONSUMIDOR where XPRODUCTO = @xproducto and CCONSUMIDOR != @cconsumidor');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    verifyConsumerUserToUpdateQuery: async(cconsumidor, xusuario) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('xusuario', sql.NVarChar, xusuario)
                .input('cconsumidor', sql.Int, cconsumidor)
                .query('select * from APCONSUMIDOR where XUSUARIO = @xusuario and CCONSUMIDOR != @cconsumidor');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    updateConsumerQuery: async(consumerData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cconsumidor', sql.Int, consumerData.cconsumidor)
                .input('xconsumidor', sql.NVarChar, consumerData.xconsumidor)
                .input('xproducto', sql.NVarChar, consumerData.xproducto)
                .input('xusuario', sql.NVarChar, consumerData.xusuario)
                .input('xemail', sql.NVarChar, consumerData.xemail)
                .input('bactivo', sql.Bit, consumerData.bactivo)
                .input('cpais', sql.Numeric(4, 0), consumerData.cpais)
                .input('ccompania', sql.Int, consumerData.ccompania)
                .input('cusuariomodificacion', sql.Int, consumerData.cusuariomodificacion)
                .input('fmodificacion', sql.DateTime, new Date())
                .query('update APCONSUMIDOR set XCONSUMIDOR = @xconsumidor, XPRODUCTO = @xproducto, XEMAIL = @xemail, XUSUARIO = @xusuario, BACTIVO = @bactivo, CPAIS = @cpais, CCOMPANIA = @ccompania, CUSUARIOMODIFICACION = @cusuariomodificacion, FMODIFICACION = @fmodificacion where CCONSUMIDOR = @cconsumidor');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    createPermissionsByConsumerUpdateQuery: async(permissions, consumerData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < permissions.length; i++){
                let insert = await pool.request()
                    .input('cconsumidor', sql.Int, consumerData.cconsumidor)
                    .input('cgrupo', sql.Int, permissions[i].cgrupo)
                    .input('cmodulo', sql.Int, permissions[i].cmodulo)
                    .input('bindice', sql.Bit, permissions[i].bindice)
                    .input('bcrear', sql.Bit, permissions[i].bcrear)
                    .input('bdetalle', sql.Bit, permissions[i].bdetalle)
                    .input('beditar', sql.Bit, permissions[i].beditar)
                    .input('beliminar', sql.Bit, permissions[i].beliminar)
                    .input('cusuariocreacion', sql.Int, consumerData.cusuariomodificacion)
                    .input('fcreacion', sql.DateTime, new Date())
                    .query('insert into APPERMISOCONSUMIDOR (CCONSUMIDOR, CGRUPO, CMODULO, BINDICE, BCREAR, BDETALLE, BEDITAR, BELIMINAR, CUSUARIOCREACION, FCREACION) values (@cconsumidor, @cgrupo, @cmodulo, @bindice, @bcrear, @bdetalle, @beditar, @beliminar, @cusuariocreacion, @fcreacion)')
                rowsAffected = rowsAffected + insert.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    updatePermissionsByConsumerUpdateQuery: async(permissions, consumerData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < permissions.length; i++){
                let update = await pool.request()
                    .input('cconsumidor', sql.Int, consumerData.cconsumidor)
                    .input('cgrupo', sql.Int, permissions[i].cgrupo)
                    .input('cmodulo', sql.Int, permissions[i].cmodulo)
                    .input('bindice', sql.Bit, permissions[i].bindice)
                    .input('bcrear', sql.Bit, permissions[i].bcrear)
                    .input('bdetalle', sql.Bit, permissions[i].bdetalle)
                    .input('beditar', sql.Bit, permissions[i].beditar)
                    .input('beliminar', sql.Bit, permissions[i].beliminar)
                    .input('cusuariomodificacion', sql.Int, consumerData.cusuariomodificacion)
                    .input('fmodificacion', sql.DateTime, new Date())
                    .query('update APPERMISOCONSUMIDOR set BINDICE = @bindice, BCREAR = @bcrear, BDETALLE = @bdetalle, BEDITAR = @beditar, BELIMINAR = @beliminar, CUSUARIOMODIFICACION = @cusuariomodificacion, FMODIFICACION = @fmodificacion where CGRUPO = @cgrupo and CMODULO = @cmodulo and CCONSUMIDOR = @cconsumidor');
                rowsAffected = rowsAffected + update.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    deletePermissionsByConsumerUpdateQuery: async(permissions, consumerData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < permissions.length; i++){
                let erase = await pool.request()
                    .input('cconsumidor', sql.Int, consumerData.cconsumidor)
                    .input('cgrupo', sql.Int, permissions[i].cgrupo)
                    .input('cmodulo', sql.Int, permissions[i].cmodulo)
                    .query('delete from APPERMISOCONSUMIDOR where CGRUPO = @cgrupo and CMODULO = @cmodulo and CCONSUMIDOR = @cconsumidor');
                rowsAffected = rowsAffected + erase.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    authenticationConsumerQuery: async(xusuario) =>{
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('xusuario', sql.NVarChar, xusuario)
                .input('bactivo', sql.Bit, true)
                .query('select * from APCONSUMIDOR where XUSUARIO = @xusuario and BACTIVO = @bactivo');
            //sql.close();
            return { result: result };
        }
        catch(err){
            return { error: err.message};
        }
    },
    searchPlanQuery: async(searchData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cpais', sql.Numeric(4, 0), searchData.cpais)
                .input('ccompania', sql.Int, searchData.ccompania)
                .input('ctipoplan', sql.Int, searchData.ctipoplan ? searchData.ctipoplan : null)
                .input('xplan', sql.NVarChar, searchData.xplan ? searchData.xplan : null)
                .query(`select * from POPLAN where CPAIS = @cpais and CCOMPANIA = @ccompania${ searchData.ctipoplan ? ' and CTIPOPLAN = @CTIPOPLAN' : '' }${ searchData.xplan ? ' and XPLAN = @xplan' : '' }`);
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    verifyPlanNameToCreateQuery: async(planData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cpais', sql.Numeric(4, 0), planData.cpais)
                .input('ccompania', sql.Int, planData.ccompania)
                .input('ctipoplan', sql.Int, planData.ctipoplan)
                .input('xplan', sql.NVarChar, planData.xplan)
                .query('select * from POPLAN where XPLAN = @xplan and CTIPOPLAN = @ctipoplan and CPAIS = @cpais and CCOMPANIA = @ccompania');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    createPlanQuery: async(planData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('xplan', sql.NVarChar, planData.xplan)
                .input('ctipoplan', sql.Int, planData.ctipoplan)
                .input('bactivo', sql.Bit, planData.bactivo)
                .input('cpais', sql.Numeric(4, 0), planData.cpais)
                .input('ccompania', sql.Int, planData.ccompania)
                .input('cusuariocreacion', sql.Int, planData.cusuariocreacion)
                .input('fcreacion', sql.DateTime, new Date())
                .query('insert into POPLAN (XPLAN, CTIPOPLAN, BACTIVO, CPAIS, CCOMPANIA, CUSUARIOCREACION, FCREACION) output inserted.CPLAN values (@xplan, @ctipoplan, @bactivo, @cpais, @ccompania, @cusuariocreacion, @fcreacion)');
            if(result.rowsAffected > 0 && planData.paymentMethodologies){
                for(let i = 0; i < planData.paymentMethodologies.length; i++){
                    let insert = await pool.request()
                        .input('cplan', sql.Int, result.recordset[0].CPLAN)
                        .input('cmetodologiapago', sql.Int, planData.paymentMethodologies[i].cmetodologiapago)
                        .input('mmetodologiapago', sql.Numeric(11, 2), planData.paymentMethodologies[i].mmetodologiapago)
                        .input('cusuariocreacion', sql.Int, planData.cusuariocreacion)
                        .input('fcreacion', sql.DateTime, new Date())
                        .query('insert into POMETODOLOGIAPAGOPLAN (CPLAN, CMETODOLOGIAPAGO, MMETODOLOGIAPAGO, CUSUARIOCREACION, FCREACION) values (@cplan, @cmetodologiapago, @mmetodologiapago, @cusuariocreacion, @fcreacion)')
                }
            }
            if(result.rowsAffected > 0 && planData.insurers){
                for(let i = 0; i < planData.insurers.length; i++){
                    let insert = await pool.request()
                        .input('cplan', sql.Int, result.recordset[0].CPLAN)
                        .input('caseguradora', sql.Int, planData.insurers[i].caseguradora)
                        .input('cusuariocreacion', sql.Int, planData.cusuariocreacion)
                        .input('fcreacion', sql.DateTime, new Date())
                        .query('insert into POASEGURADORAPLAN (CPLAN, CASEGURADORA, CUSUARIOCREACION, FCREACION) values (@cplan, @caseguradora, @cusuariocreacion, @fcreacion)')
                }
            }
            if(result.rowsAffected > 0 && planData.services){
                for(let i = 0; i < planData.services.length; i++){
                    let insert = await pool.request()
                        .input('cplan', sql.Int, result.recordset[0].CPLAN)
                        .input('cservicio', sql.Int, planData.services[i].cservicio)
                        .input('ctiposervicio', sql.Int, planData.services[i].ctiposervicio)
                        .input('ctipoagotamientoservicio', sql.Int, planData.services[i].ctipoagotamientoservicio)
                        .input('ncantidad', sql.Int, planData.services[i].ncantidad)
                        .input('pservicio', sql.Numeric(5, 2), planData.services[i].pservicio)
                        .input('mmaximocobertura', sql.Numeric(11, 2), planData.services[i].mmaximocobertura)
                        .input('mdeducible', sql.Numeric(11, 2), planData.services[i].mdeducible)
                        .input('bserviciopadre', sql.Bit, planData.services[i].bserviciopadre)
                        .input('cusuariocreacion', sql.Int, planData.cusuariocreacion)
                        .input('fcreacion', sql.DateTime, new Date())
                        .query('insert into POSERVICIOPLAN (CPLAN, CSERVICIO, CTIPOSERVICIO, CTIPOAGOTAMIENTOSERVICIO, NCANTIDAD, PSERVICIO, MMAXIMOCOBERTURA, MDEDUCIBLE, BSERVICIOPADRE, CUSUARIOCREACION, FCREACION) output inserted.CSERVICIOPLAN values (@cplan, @cservicio, @ctiposervicio, @ctipoagotamientoservicio, @ncantidad, @pservicio, @mmaximocobertura, @mdeducible, @bserviciopadre, @cusuariocreacion, @fcreacion)')
                    if(planData.services[i].coverages){
                        for(let j = 0; j < planData.services[i].coverages.length; j++){
                            let subInsert = await pool.request()
                                .input('cservicioplan', sql.Int, insert.recordset[0].CSERVICIOPLAN)
                                .input('ccobertura', sql.Int, planData.services[i].coverages[j].ccobertura)
                                .input('cconceptocobertura', sql.Numeric(4, 0), planData.services[i].coverages[j].cconceptocobertura)
                                .input('cusuariocreacion', sql.Int, planData.cusuariocreacion)
                                .input('fcreacion', sql.DateTime, new Date())
                                .query('insert into POCOBERTURASERVICIO (CSERVICIOPLAN, CCOBERTURA, CCONCEPTOCOBERTURA, CUSUARIOCREACION, FCREACION) values (@cservicioplan, @ccobertura, @cconceptocobertura, @cusuariocreacion, @fcreacion)')
                        }
                    }
                }
            }
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    getPlanData: async(cplan) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cplan', sql.Int, cplan)
                .query('select * from PRPLAN_RC where CPLAN_RC = @cplan');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },//this function is for the fleetcontract module
    getPlanCoverages: async(cplan, ccontratoflota) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('ccontratoflota', sql.Int, ccontratoflota)
                .query('select * from VWBUSCARCOBERTURASXCONTRATOFLOTA where ccontratoflota = @ccontratoflota');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    getCoverageServices: async(ccobertura) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('ccobertura', sql.Int, ccobertura)
                .query('select * from VWBUSCARSERVICIOXCOBERTURA where ccobertura = @ccobertura');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    getCoverageAnnexesQuery: async(ccobertura) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('CCOBERTURA', sql.Int, ccobertura)
                .query('select * from MACOBERTURA_ANEXO WHERE CCOBERTURA = @CCOBERTURA')
            return { result: result };
        }catch(err){
            console.log(err.message);
            return { error: err.message }
        }
    },
    getPlanArys: async(cplan) => {
       try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cplan', sql.Int, cplan)
                .query('select * from POPLAN where CPLAN = @cplan');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    getFleetContractAccesoriesQuery: async(ccontratoflota) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('CCONTRATOFLOTA', sql.Int, ccontratoflota)
                .query('SELECT * FROM VWBUSCARACCESORIOSXCONTRATO WHERE CCONTRATOFLOTA = @CCONTRATOFLOTA')
            return { result: result}
        }catch(err){
            console.log(err.message);
            return { error: err.message };
        }
    },
    getPlanDataQuery: async(planData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cpais', sql.Numeric(4, 0), planData.cpais)
                .input('ccompania', sql.Int, planData.ccompania)
                .input('cplan', sql.Int, planData.cplan)
                .query('select * from POPLAN where CPAIS = @cpais and CCOMPANIA = @ccompania and CPLAN = @cplan');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },//this function is for the plan module
    getPlanCoveragesDataQuery: async(cplan) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cplan', sql.Int, cplan)
                .query('select * from VWBUSCARCOBERTURASXPLAN where cplan = @cplan');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    getPlanPaymentMethodologiesDataQuery: async(cplan) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cplan', sql.Int, cplan)
                .query('select * from VWBUSCARMETODOLOGIAPAGOXPLANDATA where CPLAN = @cplan');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    getPlanInsurersDataQuery: async(cplan) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cplan', sql.Int, cplan)
                .query('select * from VWBUSCARASEGURADORAXPLANDATA where CPLAN = @cplan');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    getPlanServicesData: async(cplan) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cplan', sql.Int, cplan)
                .query('select * from VWBUSCARSERVICIOSXPLAN where cplan = @cplan');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    getFleetContractServices: async(ccarga) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('ccarga', sql.Int, ccarga)
                .query('select * from VWBUSCARSERVICIOSXCONTRATOFLOTA where ccarga = @ccarga');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    getPlanServicesDataQuery: async(cplan) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cplan', sql.Int, cplan)
                .query('select * from VWBUSCARSERVICIOXPLANDATA where CPLAN = @cplan');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    getCoveragesServiceDataQuery: async(cservicioplan) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cservicioplan', sql.Int, cservicioplan)
                .query('select * from VWBUSCARCOBERTURAXSERVICIODATA where CSERVICIOPLAN = @cservicioplan');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    getPlanServicesInsurersDataQuery: async(cplan) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cplan', sql.Int, cplan)
                .query('select * from VWBUSCARSERVICIOASEGURADORAXPLANDATA where CPLAN = @cplan');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    verifyPlanNameToUpdateQuery: async(planData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cpais', sql.Numeric(4, 0), planData.cpais)
                .input('ccompania', sql.Int, planData.ccompania)
                .input('xplan', sql.NVarChar, planData.xplan)
                .input('cplan', sql.Int, planData.cplan)
                .input('ctipoplan', sql.Int, planData.ctipoplan)
                .query('select * from POPLAN where XPLAN = @xplan and CPLAN != @cplan and CPAIS = @cpais and CCOMPANIA = @ccompania and CTIPOPLAN = @ctipoplan');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    updatePlanQuery: async(planData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cpais', sql.Numeric(4, 0), planData.cpais)
                .input('ccompania', sql.Int, planData.ccompania)
                .input('cplan', sql.Int, planData.cplan)
                .input('ctipoplan', sql.Int, planData.ctipoplan)
                .input('xplan', sql.NVarChar, planData.xplan)
                .input('bactivo', sql.Bit, planData.bactivo)
                .input('parys', sql.Numeric(4, 2), planData.parys)
                .input('paseguradora', sql.Numeric(4, 2), planData.paseguradora)
                .input('cusuariomodificacion', sql.Int, planData.cusuariomodificacion)
                .input('fmodificacion', sql.DateTime, new Date())
                .query('update POPLAN set XPLAN = @xplan, CTIPOPLAN = @ctipoplan, BACTIVO = @bactivo,PARYS = @parys,PASEGURADORA = @paseguradora, CUSUARIOMODIFICACION = @cusuariomodificacion, FMODIFICACION = @fmodificacion where CPLAN = @cplan and CPAIS = @cpais and CCOMPANIA = @ccompania');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    deletePaymentMethodologiesByPlanUpdateQuery: async(paymentMethodologies, planData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < paymentMethodologies.length; i++){
                let erase = await pool.request()
                    .input('cplan', sql.Int, planData.cplan)
                    .input('cmetodologiapago', sql.Int, paymentMethodologies[i].cmetodologiapago)
                    .query('delete from POMETODOLOGIAPAGOPLAN where CMETODOLOGIAPAGO = @cmetodologiapago and CPLAN = @cplan');
                rowsAffected = rowsAffected + erase.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    updatePaymentMethodologiesByPlanUpdateQuery: async(paymentMethodologies, planData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < paymentMethodologies.length; i++){
                let update = await pool.request()
                    .input('cplan', sql.Int, planData.cplan)
                    .input('cmetodologiapago', sql.Int, paymentMethodologies[i].cmetodologiapago)
                    .input('mmetodologiapago', sql.Numeric(11, 2), paymentMethodologies[i].mmetodologiapago)
                    .input('cusuariomodificacion', sql.Int, planData.cusuariomodificacion)
                    .input('fmodificacion', sql.DateTime, new Date())
                    .query('update POMETODOLOGIAPAGOPLAN set MMETODOLOGIAPAGO = @mmetodologiapago, CUSUARIOMODIFICACION = @cusuariomodificacion, FMODIFICACION = @fmodificacion where CMETODOLOGIAPAGO = @cmetodologiapago and CPLAN = @cplan');
                rowsAffected = rowsAffected + update.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    createPaymentMethodologiesByPlanUpdateQuery: async(paymentMethodologies, planData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < paymentMethodologies.length; i++){
                let insert = await pool.request()
                    .input('cplan', sql.Int, planData.cplan)
                    .input('cmetodologiapago', sql.Int, paymentMethodologies[i].cmetodologiapago)
                    .input('mmetodologiapago', sql.Numeric(11, 2), paymentMethodologies[i].mmetodologiapago)
                    .input('cusuariocreacion', sql.Int, planData.cusuariomodificacion)
                    .input('fcreacion', sql.DateTime, new Date())
                    .query('insert into POMETODOLOGIAPAGOPLAN (CPLAN, CMETODOLOGIAPAGO, MMETODOLOGIAPAGO, CUSUARIOCREACION, FCREACION) values (@cplan, @cmetodologiapago, @mmetodologiapago, @cusuariocreacion, @fcreacion)')
                rowsAffected = rowsAffected + insert.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    deleteInsurersByPlanUpdateQuery: async(insurers, planData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < insurers.length; i++){
                let erase = await pool.request()
                    .input('cplan', sql.Int, planData.cplan)
                    .input('caseguradora', sql.Int, insurers[i].caseguradora)
                    .query('delete from POASEGURADORAPLAN where CASEGURADORA = @caseguradora and CPLAN = @cplan');
                rowsAffected = rowsAffected + erase.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    updateInsurersByPlanUpdateQuery: async(insurers, planData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < insurers.length; i++){
                let update = await pool.request()
                    .input('cplan', sql.Int, planData.cplan)
                    .input('caseguradora', sql.Int, insurers[i].caseguradora)
                    .input('cusuariomodificacion', sql.Int, planData.cusuariomodificacion)
                    .input('fmodificacion', sql.DateTime, new Date())
                    .query('update POASEGURADORAPLAN set CUSUARIOMODIFICACION = @cusuariomodificacion, FMODIFICACION = @fmodificacion where CASEGURADORA = @caseguradora and CPLAN = @cplan');
                rowsAffected = rowsAffected + update.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    createInsurersByPlanUpdateQuery: async(insurers, planData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < insurers.length; i++){
                let insert = await pool.request()
                    .input('cplan', sql.Int, planData.cplan)
                    .input('caseguradora', sql.Int, insurers[i].caseguradora)
                    .input('cusuariocreacion', sql.Int, planData.cusuariomodificacion)
                    .input('fcreacion', sql.DateTime, new Date())
                    .query('insert into POASEGURADORAPLAN (CPLAN, CASEGURADORA, CUSUARIOCREACION, FCREACION) values (@cplan, @caseguradora, @cusuariocreacion, @fcreacion)')
                rowsAffected = rowsAffected + insert.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    deleteServicesByPlanUpdateQuery: async(services, planData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < services.length; i++){
                let suberase = await pool.request()
                    .input('cservicioplan', sql.Int, services[i].cservicioplan)
                    .query('delete from POCOBERTURASERVICIO where CSERVICIOPLAN = @cservicioplan');
                let erase = await pool.request()
                    .input('cplan', sql.Int, planData.cplan)
                    .input('cservicio', sql.Int, services[i].cservicio)
                    .input('cservicioplan', sql.Int, services[i].cservicioplan)
                    .query('delete from POSERVICIOPLAN where CSERVICIO = @cservicio and CSERVICIOPLAN = @cservicioplan and CPLAN = @cplan');
                rowsAffected = rowsAffected + erase.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    updateServicesByPlanUpdateQuery: async(services, planData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < services.length; i++){
                let update = await pool.request()
                    .input('cplan', sql.Int, planData.cplan)
                    .input('cservicio', sql.Int, services[i].cservicio)
                    .input('cservicioplan', sql.Int, services[i].cservicioplan)
                    .input('ctiposervicio', sql.Int, services[i].ctiposervicio)
                    .input('ctipoagotamientoservicio', sql.Int, services[i].ctipoagotamientoservicio)
                    .input('ncantidad', sql.Int, services[i].ncantidad)
                    .input('pservicio', sql.Numeric(5, 2), services[i].pservicio)
                    .input('mmaximocobertura', sql.Numeric(11, 2), services[i].mmaximocobertura)
                    .input('mdeducible', sql.Numeric(11, 2), services[i].mdeducible)
                    .input('bserviciopadre', sql.Bit, services[i].bserviciopadre)
                    .input('cusuariomodificacion', sql.Int, planData.cusuariomodificacion)
                    .input('fmodificacion', sql.DateTime, new Date())
                    .query('update POSERVICIOPLAN set CTIPOAGOTAMIENTOSERVICIO = @ctipoagotamientoservicio, NCANTIDAD = @ncantidad, PSERVICIO = @pservicio, MMAXIMOCOBERTURA = @mmaximocobertura, MDEDUCIBLE = @mdeducible, BSERVICIOPADRE = @bserviciopadre, CUSUARIOMODIFICACION = @cusuariomodificacion, FMODIFICACION = @fmodificacion where CSERVICIO = @cservicio and CSERVICIOPLAN = @cservicioplan and CTIPOSERVICIO = @ctiposervicio and CPLAN = @cplan');
                rowsAffected = rowsAffected + update.rowsAffected;
                if(services[i].coverages){
                    if(update.rowsAffected > 0 && services[i].coverages.create){
                        for(let j = 0; j < services[i].coverages.create.length; j++){
                            let subInsert = await pool.request()
                                .input('cservicioplan', sql.Int, services[i].cservicioplan)
                                .input('ccobertura', sql.Int, services[i].coverages.create[j].ccobertura)
                                .input('cconceptocobertura', sql.Int, services[i].coverages.create[j].cconceptocobertura)
                                .input('cusuariocreacion', sql.Int, planData.cusuariomodificacion)
                                .input('fcreacion', sql.DateTime, new Date())
                                .query('insert into POCOBERTURASERVICIO (CSERVICIOPLAN, CCOBERTURA, CCONCEPTOCOBERTURA, CUSUARIOCREACION, FCREACION) values (@cservicioplan, @ccobertura, @cconceptocobertura, @cusuariocreacion, @fcreacion)')
                        }
                    }
                    if(update.rowsAffected > 0 && services[i].coverages.update){
                        for(let j = 0; j < services[i].coverages.update.length; j++){
                            let subUpdate = await pool.request()
                                .input('cservicioplan', sql.Int, services[i].cservicioplan)
                                .input('ccobertura', sql.Int, services[i].coverages.update[j].ccobertura)
                                .input('cconceptocobertura', sql.Int, services[i].coverages.update[j].cconceptocobertura)
                                .input('cusuariomodificacion', sql.Int, planData.cusuariomodificacion)
                                .input('fmodificacion', sql.DateTime, new Date())
                                .query('update POCOBERTURASERVICIO set CCONCEPTOCOBERTURA = @cconceptocobertura, CUSUARIOMODIFICACION = @cusuariomodificacion, FMODIFICACION = @fmodificacion where CSERVICIOPLAN = @cservicioplan and CCOBERTURA = @ccobertura')
                        }
                    }
                    if(update.rowsAffected > 0 && services[i].coverages.delete){
                        for(let j = 0; j < services[i].coverages.delete.length; j++){
                            let subDelete = await pool.request()
                                .input('cservicioplan', sql.Int, services[i].cservicioplan)
                                .input('ccobertura', sql.Int, services[i].coverages.delete[j].ccobertura)
                                .query('delete from POCOBERTURASERVICIO where CSERVICIOPLAN = @cservicioplan and CCOBERTURA = @ccobertura')
                        }
                    }
                }
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    createServicesByPlanUpdateQuery: async(services, planData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < services.length; i++){
                let insert = await pool.request()
                    .input('cplan', sql.Int, planData.cplan)
                    .input('cservicio', sql.Int, services[i].cservicio)
                    .input('ctiposervicio', sql.Int, services[i].ctiposervicio)
                    .input('ctipoagotamientoservicio', sql.Int, services[i].ctipoagotamientoservicio)
                    .input('ncantidad', sql.Int, services[i].ncantidad)
                    .input('pservicio', sql.Numeric(5, 2), services[i].pservicio)
                    .input('mmaximocobertura', sql.Numeric(11, 2), services[i].mmaximocobertura)
                    .input('mdeducible', sql.Numeric(11, 2), services[i].mdeducible)
                    .input('bserviciopadre', sql.Bit, services[i].bserviciopadre)
                    .input('cusuariocreacion', sql.Int, planData.cusuariomodificacion)
                    .input('fcreacion', sql.DateTime, new Date())
                    .query('insert into POSERVICIOPLAN (CPLAN, CSERVICIO, CTIPOSERVICIO, CTIPOAGOTAMIENTOSERVICIO, NCANTIDAD, PSERVICIO, MMAXIMOCOBERTURA, MDEDUCIBLE, BSERVICIOPADRE, CUSUARIOCREACION, FCREACION) output inserted.CSERVICIOPLAN values (@cplan, @cservicio, @ctiposervicio, @ctipoagotamientoservicio, @ncantidad, @pservicio, @mmaximocobertura, @mdeducible, @bserviciopadre, @cusuariocreacion, @fcreacion)')
                rowsAffected = rowsAffected + insert.rowsAffected;
                if(insert.rowsAffected > 0 && services[i].coverages){
                    for(let j = 0; j < services[i].coverages.length; j++){
                        let subInsert = await pool.request()
                            .input('cservicioplan', sql.Int, insert.recordset[0].CSERVICIOPLAN)
                            .input('ccobertura', sql.Int, services[i].coverages[j].ccobertura)
                            .input('cconceptocobertura', sql.Int, services[i].coverages[j].cconceptocobertura)
                            .input('cusuariocreacion', sql.Int, planData.cusuariomodificacion)
                            .input('fcreacion', sql.DateTime, new Date())
                            .query('insert into POCOBERTURASERVICIO (CSERVICIOPLAN, CCOBERTURA, CCONCEPTOCOBERTURA, CUSUARIOCREACION, FCREACION) values (@cservicioplan, @ccobertura, @cconceptocobertura, @cusuariocreacion, @fcreacion)')
                    }
                }
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    createServicesInsurersByPlanUpdateQuery: async(services, planData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < services.length; i++){
                let insert = await pool.request()
                    .input('cplan', sql.Int, planData.cplan)
                    .input('cservicio', sql.Int, services[i].cservicio)
                    .input('ctiposervicio', sql.Int, services[i].ctiposervicio)
                    .input('ctipoagotamientoservicio', sql.Int, services[i].ctipoagotamientoservicio)
                    .input('ncantidad', sql.Int, services[i].ncantidad)
                    .input('pservicio', sql.Numeric(5, 2), services[i].pservicio)
                    .input('mmaximocobertura', sql.Numeric(11, 2), services[i].mmaximocobertura)
                    .input('mdeducible', sql.Numeric(11, 2), services[i].mdeducible)
                    .input('bserviciopadre', sql.Bit, services[i].bserviciopadre)
                    .input('cusuariocreacion', sql.Int, planData.cusuariomodificacion)
                    .input('fcreacion', sql.DateTime, new Date())
                    .query('insert into POSERVICIOPLAN_RC (CPLAN, CSERVICIO, CTIPOSERVICIO, CTIPOAGOTAMIENTOSERVICIO, NCANTIDAD, PSERVICIO, MMAXIMOCOBERTURA, MDEDUCIBLE, BSERVICIOPADRE, CUSUARIOCREACION, FCREACION) output inserted.CSERVICIOPLAN values (@cplan, @cservicio, @ctiposervicio, @ctipoagotamientoservicio, @ncantidad, @pservicio, @mmaximocobertura, @mdeducible, @bserviciopadre, @cusuariocreacion, @fcreacion)')
                rowsAffected = rowsAffected + insert.rowsAffected;
                if(insert.rowsAffected > 0 && services[i].coverages){
                    for(let j = 0; j < services[i].coverages.length; j++){
                        let subInsert = await pool.request()
                            .input('cservicioplan', sql.Int, insert.recordset[0].CSERVICIOPLAN)
                            .input('ccobertura', sql.Int, services[i].coverages[j].ccobertura)
                            .input('cconceptocobertura', sql.Int, services[i].coverages[j].cconceptocobertura)
                            .input('cusuariocreacion', sql.Int, planData.cusuariomodificacion)
                            .input('fcreacion', sql.DateTime, new Date())
                            .query('insert into POCOBERTURASERVICIO (CSERVICIOPLAN, CCOBERTURA, CCONCEPTOCOBERTURA, CUSUARIOCREACION, FCREACION) values (@cservicioplan, @ccobertura, @cconceptocobertura, @cusuariocreacion, @fcreacion)')
                    }
                }
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    verifyVehiclePlateToCreateQuery: async(xplaca, cpais) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cpais', sql.Numeric(4, 0), cpais)
                .input('xplaca', sql.NVarChar, xplaca)
                .query('select * from TRVEHICULOPROPIETARIO where XPLACA = @xplaca and CPAIS = @cpais');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    searchOwnerQuery: async(searchData) => {
        try{
            let query = `select * from TRPROPIETARIO where CPAIS = @cpais and CCOMPANIA = @ccompania${ searchData.xnombre ? " and XNOMBRE like '%" + searchData.xnombre + "%'" : '' }${ searchData.ctipodocidentidad ? " and CTIPODOCIDENTIDAD = @ctipodocidentidad" : '' }${ searchData.xdocidentidad ? " and XDOCIDENTIDAD like '%" + searchData.xdocidentidad + "%'" : '' }${ searchData.xapellido ? " and XAPELLIDO like '%" + searchData.xapellido + "%'" : '' }${ searchData.xemail ? " and XEMAIL like '%" + searchData.xemail + "%'" : '' }`;
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cpais', sql.Numeric(4, 0), searchData.cpais ? searchData.cpais : 1)
                .input('ccompania', sql.Int, searchData.ccompania ? searchData.ccompania : 1)
                .input('ctipodocidentidad', sql.Int, searchData.ctipodocidentidad ? searchData.ctipodocidentidad : 1)
                .query(query);
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    verifyOwnerIdentificationToCreateQuery: async(ownerData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cpais', sql.Numeric(4, 0), ownerData.cpais)
                .input('ccompania', sql.Int, ownerData.ccompania)
                .input('ctipodocidentidad', sql.Int, ownerData.ctipodocidentidad)
                .input('xdocidentidad', sql.NVarChar, ownerData.xdocidentidad)
                .query('select * from TRPROPIETARIO where XDOCIDENTIDAD = @xdocidentidad and CTIPODOCIDENTIDAD = @ctipodocidentidad and CPAIS = @cpais and CCOMPANIA = @ccompania');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    verifyOwnerEmailToCreateQuery: async(ownerData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cpais', sql.Numeric(4, 0), ownerData.cpais)
                .input('ccompania', sql.Int, ownerData.ccompania)
                .input('xemail', sql.NVarChar, ownerData.xemail)
                .query('select * from TRPROPIETARIO where XEMAIL = @xemail and CPAIS = @cpais and CCOMPANIA = @ccompania');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    createOwnerQuery: async(ownerData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cpais', sql.Numeric(4, 0), ownerData.cpais)
                .input('ccompania', sql.Int, ownerData.ccompania)
                .input('xnombre', sql.NVarChar, ownerData.xnombre)
                .input('xapellido', sql.NVarChar, ownerData.xapellido)
                .input('cestadocivil', sql.Int, ownerData.cestadocivil)
                .input('fnacimiento', sql.DateTime, ownerData.fnacimiento)
                .input('xprofesion', sql.NVarChar, ownerData.xprofesion ? ownerData.xprofesion : null)
                .input('xocupacion', sql.NVarChar, ownerData.xocupacion ? ownerData.xocupacion : null)
                .input('ctipodocidentidad', sql.Int, ownerData.ctipodocidentidad)
                .input('xdocidentidad', sql.NVarChar, ownerData.xdocidentidad)
                .input('cestado', sql.Int, ownerData.cestado)
                .input('cciudad', sql.Int, ownerData.cciudad)
                .input('xdireccion', sql.NVarChar, ownerData.xdireccion)
                .input('xemail', sql.NVarChar, ownerData.xemail)
                .input('xtelefonocasa', sql.NVarChar, ownerData.xtelefonocasa ? ownerData.xtelefonocasa : null)
                .input('xtelefonocelular', sql.NVarChar, ownerData.xtelefonocelular)
                .input('xfax', sql.NVarChar, ownerData.xfax ? ownerData.xfax : null)
                .input('cparentesco', sql.Int, ownerData.cparentesco)
                .input('bactivo', sql.Bit, ownerData.bactivo)
                .input('cusuariocreacion', sql.Int, ownerData.cusuariocreacion)
                .input('fcreacion', sql.DateTime, new Date())
                .input('cprocedencia', sql.Char(3), ownerData.cprocedencia)
                .input('csexo', sql.Char(3), ownerData.csexo)
                .input('xnacionalidad', sql.NVarChar, ownerData.xemail)
                .query('insert into TRPROPIETARIO (CPAIS, CCOMPANIA, XNOMBRE, XAPELLIDO, CESTADOCIVIL, FNACIMIENTO, XPROFESION, XOCUPACION, CTIPODOCIDENTIDAD, XDOCIDENTIDAD, CESTADO, CCIUDAD, XDIRECCION, XEMAIL, XTELEFONOCASA, XTELEFONOCELULAR, XFAX, CPARENTESCO, BACTIVO, CUSUARIOCREACION, FCREACION, CPROCEDENCIA, CSEXO, XNACIONALIDAD) output inserted.CPROPIETARIO values (@cpais, @ccompania, @xnombre, @xapellido, @cestadocivil, @fnacimiento, @xprofesion, @xocupacion, @ctipodocidentidad, @xdocidentidad, @cestado, @cciudad, @xdireccion, @xemail, @xtelefonocasa, @xtelefonocelular, @xfax, @cparentesco, @bactivo, @cusuariocreacion, @fcreacion, @cprocedencia, @csexo, @xnacionalidad)');
            if(result.rowsAffected > 0 && ownerData.documents){
                for(let i = 0; i < ownerData.documents.length; i++){
                    let insert = await pool.request()
                        .input('cpropietario', sql.Int, result.recordset[0].CPROPIETARIO)
                        .input('cdocumento', sql.Int, ownerData.documents[i].cdocumento)
                        .input('xrutaarchivo', sql.NVarChar, ownerData.documents[i].xrutaarchivo)
                        .input('cusuariocreacion', sql.Int, ownerData.cusuariocreacion)
                        .input('fcreacion', sql.DateTime, new Date())
                        .query('insert into TRDOCUMENTOPROPIETARIO (CPROPIETARIO, CDOCUMENTO, XRUTAARCHIVO, CUSUARIOCREACION, FCREACION) values (@cpropietario, @cdocumento, @xrutaarchivo, @cusuariocreacion, @fcreacion)')
                }
            }
            if(result.rowsAffected > 0 && ownerData.vehicles){
                for(let i = 0; i < ownerData.vehicles.length; i++){
                    let insert = await pool.request()
                        .input('cpropietario', sql.Int, result.recordset[0].CPROPIETARIO)
                        .input('cmarca', sql.Int, ownerData.vehicles[i].cmarca)
                        .input('cmodelo', sql.Int, ownerData.vehicles[i].cmodelo)
                        .input('cversion', sql.Int, ownerData.vehicles[i].cversion)
                        .input('xplaca', sql.NVarChar, ownerData.vehicles[i].xplaca)
                        .input('fano', sql.Numeric(4, 0), ownerData.vehicles[i].fano)
                        .input('xcolor', sql.NVarChar, ownerData.vehicles[i].xcolor)
                        .input('nkilometraje', sql.Numeric(11, 2), ownerData.vehicles[i].nkilometraje)
                        .input('bimportado', sql.Bit, ownerData.vehicles[i].bimportado)
                        .input('xcertificadoorigen', sql.NVarChar, ownerData.vehicles[i].xcertificadoorigen)
                        .input('mpreciovehiculo', sql.Numeric(11, 2), ownerData.vehicles[i].mpreciovehiculo)
                        .input('xserialcarroceria', sql.NVarChar, ownerData.vehicles[i].xserialcarroceria)
                        .input('xserialmotor', sql.NVarChar, ownerData.vehicles[i].xserialmotor)
                        .input('cpais', sql.Numeric(4, 0), ownerData.cpais)
                        .input('cusuariocreacion', sql.Int, ownerData.cusuariocreacion)
                        .input('fcreacion', sql.DateTime, new Date())
                        .input('cmoneda', sql.Int, ownerData.vehicles[i].cmoneda)
                        .input('xuso', sql.NVarChar, ownerData.vehicles[i].xuso)
                        .input('xtipomodelo', sql.NVarChar, ownerData.vehicles[i].xtipomodelo)
                        .input('ncapacidadcarga', sql.Numeric(11, 2), ownerData.vehicles[i].ncapacidadcarga)
                        .input('ncapacidadpasajeros', sql.Int, ownerData.vehicles[i].ncapacidadpasajeros)
                        .query('insert into TRVEHICULOPROPIETARIO (CPROPIETARIO, CMARCA, CMODELO, CVERSION, XPLACA, FANO, XCOLOR, NKILOMETRAJE, BIMPORTADO, XCERTIFICADOORIGEN, MPRECIOVEHICULO, XSERIALCARROCERIA, XSERIALMOTOR, CPAIS, CUSUARIOCREACION, FCREACION, NCAPACIDADPASAJEROS, NCAPACIDADCARGA, XUSO, xtipo, CMONEDA) output inserted.CVEHICULOPROPIETARIO values (@cpropietario, @cmarca, @cmodelo, @cversion, @xplaca, @fano, @xcolor, @nkilometraje, @bimportado, @xcertificadoorigen, @mpreciovehiculo, @xserialcarroceria, @xserialmotor, @cpais, @cusuariocreacion, @fcreacion, @ncapacidadpasajeros, @ncapacidadcarga, @xuso, @xtipo, @cmoneda)');
                    if(ownerData.vehicles[i].images){
                        for(let j = 0; j < ownerData.vehicles[i].images.length; j++){
                            let subInsert = await pool.request()
                                .input('cvehiculopropietario', sql.Int, insert.recordset[0].CVEHICULOPROPIETARIO)
                                .input('cimagen', sql.Int, ownerData.vehicles[i].images[j].cimagen)
                                .input('xrutaimagen', sql.NVarChar, ownerData.vehicles[i].images[j].xrutaimagen)
                                .input('cusuariocreacion', sql.Int, ownerData.cusuariocreacion)
                                .input('fcreacion', sql.DateTime, new Date())
                                .query('insert into TRIMAGENVEHICULO (CVEHICULOPROPIETARIO, CIMAGEN, XRUTAIMAGEN, CUSUARIOCREACION, FCREACION) values (@cvehiculopropietario, @cimagen, @xrutaimagen, @cusuariocreacion, @fcreacion)')
                        }
                    }
                }
            }
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    civilStatusValrepQuery: async(searchData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cpais', sql.Numeric(4, 0), searchData.cpais)
                .input('ccompania', sql.Int, searchData.ccompania)
                .query('select CESTADOCIVIL, XESTADOCIVIL, BACTIVO from MAESTADOCIVIL where CPAIS = @cpais and CCOMPANIA = @ccompania');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    processDocumentValrepQuery: async(searchData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cpais', sql.Numeric(4, 0), searchData.cpais)
                .input('ccompania', sql.Int, searchData.ccompania)
                .input('cmodulo', sql.Int, searchData.cmodulo)
                .query('select CDOCUMENTO, XDOCUMENTO, BACTIVO from VWDOCUMENTOXMODULOXPROCESODATA where CPAIS = @cpais and CCOMPANIA = @ccompania and CMODULO = @cmodulo');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    documentTypeValrepQuery: async(searchData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cpais', sql.Numeric(4, 0), searchData.cpais)
                .query('select CTIPODOCIDENTIDAD, XTIPODOCIDENTIDAD, BACTIVO from MATIPODOCIDENTIDAD where CPAIS = @cpais');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    stateValrepQuery: async(cpais) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cpais', sql.Numeric(4, 0), cpais)
                .query('select CESTADO, XESTADO, BACTIVO from MAESTADO where CPAIS = @cpais');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    cityValrepQuery: async(searchData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cpais', sql.Numeric(4, 0), searchData.cpais)
                .input('cestado', sql.Int, searchData.cestado)
                .query('select CCIUDAD, XCIUDAD, BACTIVO from MACIUDAD where CESTADO = @cestado and CPAIS = @cpais');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    relationshipValrepQuery: async(searchData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cpais', sql.Numeric(4, 0), searchData.cpais)
                .query('select CPARENTESCO, XPARENTESCO, BACTIVO from MAPARENTESCO where CPAIS = @cpais');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    brandValrepQuery: async(searchData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cpais', sql.Numeric(4, 0), searchData.cpais)
                .query('select CMARCA, XMARCA, BACTIVO from MAMARCA where CPAIS = @cpais');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    modelValrepQuery: async(searchData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cpais', sql.Numeric(4, 0), searchData.cpais)
                .input('cmarca', sql.Int, searchData.cmarca)
                .query('select CMARCA, CMODELO, XMODELO, BACTIVO from MAMODELO where CPAIS = @cpais and CMARCA = @cmarca');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    versionValrepQuery: async(searchData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cpais', sql.Numeric(4, 0), searchData.cpais)
                .input('cmarca', sql.Int, searchData.cmarca)
                .input('cmodelo', sql.Int, searchData.cmodelo)
                .query('select CVERSION, XVERSION, BACTIVO from MAVERSION where CPAIS = @cpais and CMARCA = @cmarca and CMODELO = @cmodelo');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    colorValrepQuery: async(searchData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cpais', sql.Numeric(4, 0), searchData.cpais)
                .query('select CCOLOR, XCOLOR, BACTIVO from MACOLOR where CPAIS = @cpais');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    getOwnerDataQuery: async(ownerData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cpais', sql.Numeric(4, 0), ownerData.cpais)
                .input('ccompania', sql.Int, ownerData.ccompania)
                .input('cpropietario', sql.Int, ownerData.cpropietario)
                .query('select * from TRPROPIETARIO where CPROPIETARIO = @cpropietario and CPAIS = @cpais and CCOMPANIA = @ccompania');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    getOwnerDocumentsDataQuery: async(cpropietario) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cpropietario', sql.Int, cpropietario)
                .query('select * from VWBUSCARDOCUMENTOXPROPIETARIODATA where CPROPIETARIO = @cpropietario');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    getOwnerVehiclesDataQuery: async(cpropietario) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cpropietario', sql.Int, cpropietario)
                .query('select * from VWBUSCARVEHICULOXPROPIETARIODATA where CPROPIETARIO = @cpropietario');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    verifyVehiclePlateToUpdateQuery: async(verifyData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cpais', sql.Numeric(4, 0), verifyData.cpais)
                .input('xplaca', sql.NVarChar, verifyData.xplaca)
                .input('cvehiculopropietario', sql.Int, verifyData.cvehiculopropietario)
                .query('select * from TRVEHICULOPROPIETARIO where XPLACA = @xplaca and CPAIS = @cpais and CVEHICULOPROPIETARIO != @cvehiculopropietario');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    verifyOwnerIdentificationToUpdateQuery: async(ownerData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cpais', sql.Numeric(4, 0), ownerData.cpais)
                .input('ccompania', sql.Int, ownerData.ccompania)
                .input('cpropietario', sql.Int, ownerData.cpropietario)
                .input('ctipodocidentidad', sql.Int, ownerData.ctipodocidentidad)
                .input('xdocidentidad', sql.NVarChar, ownerData.xdocidentidad)
                .query('select * from TRPROPIETARIO where XDOCIDENTIDAD = @xdocidentidad and CTIPODOCIDENTIDAD = @ctipodocidentidad and CPAIS = @cpais and CCOMPANIA = @ccompania and CPROPIETARIO != @cpropietario');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    verifyOwnerEmailToUpdateQuery: async(ownerData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cpais', sql.Numeric(4, 0), ownerData.cpais)
                .input('ccompania', sql.Int, ownerData.ccompania)
                .input('cpropietario', sql.Int, ownerData.cpropietario)
                .input('xemail', sql.NVarChar, ownerData.xemail)
                .query('select * from TRPROPIETARIO where XEMAIL = @xemail and CPAIS = @cpais and CCOMPANIA = @ccompania and CPROPIETARIO != @cpropietario');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    updateOwnerQuery: async(ownerData) => {
        try{
            if (ownerData.fnacimiento == "Invalid Date"){
                ownerData.fnacimiento = null
            }
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cpais', sql.Numeric(4, 0), ownerData.cpais)
                .input('ccompania', sql.Int, ownerData.ccompania)
                .input('cpropietario', sql.Int, ownerData.cpropietario)
                .input('xnombre', sql.NVarChar, ownerData.xnombre)
                .input('xapellido', sql.NVarChar, ownerData.xapellido ? ownerData.xapellido : null)
                .input('cestadocivil', sql.Int, ownerData.cestadocivil)
                .input('fnacimiento', sql.DateTime, ownerData.fnacimiento ? ownerData.fnacimiento : null)
                .input('xprofesion', sql.NVarChar, ownerData.xprofesion ? ownerData.xprofesion : null)
                .input('xocupacion', sql.NVarChar, ownerData.xocupacion ? ownerData.xocupacion : null)
                .input('ctipodocidentidad', sql.Int, ownerData.ctipodocidentidad)
                .input('xdocidentidad', sql.NVarChar, ownerData.xdocidentidad)
                .input('cestado', sql.Int, ownerData.cestado)
                .input('cciudad', sql.Int, ownerData.cciudad)
                .input('xdireccion', sql.NVarChar, ownerData.xdireccion)
                .input('xemail', sql.NVarChar, ownerData.xemail)
                .input('xtelefonocasa', sql.NVarChar, ownerData.xtelefonocasa ? ownerData.xtelefonocasa : null)
                .input('xtelefonocelular', sql.NVarChar, ownerData.xtelefonocelular)
                .input('xfax', sql.NVarChar, ownerData.xfax ? ownerData.xfax : null)
                .input('cparentesco', sql.Int, ownerData.cparentesco ? ownerData.cparentesco : null)
                .input('bactivo', sql.Bit, ownerData.bactivo)
                .input('cusuariomodificacion', sql.Int, ownerData.cusuariomodificacion)
                .input('fmodificacion', sql.DateTime, new Date())
                .query('update TRPROPIETARIO set XNOMBRE = @xnombre, XAPELLIDO = @xapellido, CESTADOCIVIL = @cestadocivil, FNACIMIENTO = @fnacimiento, XPROFESION = @xprofesion, XOCUPACION = @xocupacion, CTIPODOCIDENTIDAD = @ctipodocidentidad, XDOCIDENTIDAD = @xdocidentidad, CESTADO = @cestado, CCIUDAD = @cciudad, XDIRECCION = @xdireccion, XEMAIL = @xemail, XTELEFONOCASA = @xtelefonocasa, XTELEFONOCELULAR = @xtelefonocelular, XFAX = @xfax, CPARENTESCO = @cparentesco, BACTIVO = @bactivo, CUSUARIOMODIFICACION = @cusuariomodificacion, FMODIFICACION = @fmodificacion where CPROPIETARIO = @cpropietario and CPAIS = @cpais and CCOMPANIA = @ccompania');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    deleteDocumentsByOwnerUpdateQuery: async(documents, ownerData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < documents.length; i++){
                let erase = await pool.request()
                    .input('cpropietario', sql.Int, ownerData.cpropietario)
                    .input('cdocumentopropietario', sql.Int, documents[i].cdocumentopropietario)
                    .query('delete from TRDOCUMENTOPROPIETARIO where CDOCUMENTOPROPIETARIO = @cdocumentopropietario and CPROPIETARIO = @cpropietario');
                rowsAffected = rowsAffected + erase.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    updateDocumentsByOwnerUpdateQuery: async(documents, ownerData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < documents.length; i++){
                let update = await pool.request()
                    .input('cpropietario', sql.Int, ownerData.cpropietario)
                    .input('cdocumentopropietario', sql.Int, documents[i].cdocumentopropietario)
                    .input('cdocumento', sql.Int, documents[i].cdocumento)
                    .input('xrutaarchivo', sql.NVarChar, documents[i].xrutaarchivo)
                    .input('cusuariomodificacion', sql.Int, ownerData.cusuariomodificacion)
                    .input('fmodificacion', sql.DateTime, new Date())
                    .query('update TRDOCUMENTOPROPIETARIO set CDOCUMENTO = @cdocumento, XRUTAARCHIVO = @xrutaarchivo, CUSUARIOMODIFICACION = @cusuariomodificacion, FMODIFICACION = @fmodificacion where CDOCUMENTOPROPIETARIO = @cdocumentopropietario and CPROPIETARIO = @cpropietario');
                rowsAffected = rowsAffected + update.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    createDocumentsByOwnerUpdateQuery: async(documents, ownerData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < documents.length; i++){
                let insert = await pool.request()
                    .input('cpropietario', sql.Int, ownerData.cpropietario)
                    .input('cdocumento', sql.Int, documents[i].cdocumento)
                    .input('xrutaarchivo', sql.NVarChar, documents[i].xrutaarchivo)
                    .input('cusuariocreacion', sql.Int, ownerData.cusuariomodificacion)
                    .input('fcreacion', sql.DateTime, new Date())
                    .query('insert into TRDOCUMENTOPROPIETARIO (CPROPIETARIO, CDOCUMENTO, XRUTAARCHIVO, CUSUARIOCREACION, FCREACION) values (@cpropietario, @cdocumento, @xrutaarchivo, @cusuariocreacion, @fcreacion)')
                rowsAffected = rowsAffected + insert.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    deleteVehiclesByOwnerUpdateQuery: async(vehicles, ownerData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < vehicles.length; i++){
                let suberase = await pool.request()
                    .input('cvehiculopropietario', sql.Int, vehicles[i].cvehiculopropietario)
                    .query('delete from TRIMAGENVEHICULO where CVEHICULOPROPIETARIO = @cvehiculopropietario');
                let erase = await pool.request()
                    .input('cpropietario', sql.Int, ownerData.cpropietario)
                    .input('cvehiculopropietario', sql.Int, vehicles[i].cvehiculopropietario)
                    .query('delete from TRVEHICULOPROPIETARIO where CVEHICULOPROPIETARIO = @cvehiculopropietario and CPROPIETARIO = @cpropietario');
                rowsAffected = rowsAffected + erase.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    updateVehiclesByOwnerUpdateQuery: async(vehicles, ownerData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < vehicles.length; i++){
                let update = await pool.request()
                    .input('cpropietario', sql.Int, ownerData.cpropietario)
                    .input('cvehiculopropietario', sql.Int, vehicles[i].cvehiculopropietario)
                    .input('cmarca', sql.Int, vehicles[i].cmarca)
                    .input('cmodelo', sql.Int, vehicles[i].cmodelo)
                    .input('xplaca', sql.NVarChar, vehicles[i].xplaca)
                    .input('fano', sql.Numeric(4, 0), vehicles[i].fano)
                    .input('xcolor', sql.NVarChar, vehicles[i].xcolor)
                    .input('nkilometraje', sql.Numeric(11, 2), vehicles[i].nkilometraje)
                    .input('bimportado', sql.Bit, vehicles[i].bimportado)
                    .input('xcertificadoorigen', sql.NVarChar, vehicles[i].xcertificadoorigen)
                    .input('mpreciovehiculo', sql.Numeric(11, 2), vehicles[i].mpreciovehiculo)
                    .input('xserialcarroceria', sql.NVarChar, vehicles[i].xserialcarroceria)
                    .input('xserialmotor', sql.NVarChar, vehicles[i].xserialmotor)
                    .input('cusuariomodificacion', sql.Int, ownerData.cusuariomodificacion)
                    .input('cmoneda', sql.Int, vehicles[i].cmoneda)
                    .input('xuso', sql.NVarChar, vehicles[i].xuso)
                    .input('xtipo', sql.NVarChar, vehicles[i].xtipo)
                    .input('ncapacidadpasajeros', sql.Int, vehicles[i].ncapacidadpasajeros ? vehicles[i].ncapacidadpasajeros : undefined)
                    .input('ncapacidadcarga', sql.Numeric(11, 2), vehicles[i].ncapacidadcarga ? vehicles[i].ncapacidadcarga : undefined)
                    .input('fmodificacion', sql.DateTime, new Date())
                    .query('update TRVEHICULOPROPIETARIO set CMARCA = @cmarca, CMODELO = @cmodelo, XPLACA = @xplaca, FANO = @fano, XCOLOR = @xcolor, NKILOMETRAJE = @nkilometraje, BIMPORTADO = @bimportado, XCERTIFICADOORIGEN = @xcertificadoorigen, MPRECIOVEHICULO = @mpreciovehiculo, XSERIALCARROCERIA = @xserialcarroceria, XSERIALMOTOR = @xserialmotor, CUSUARIOMODIFICACION = @cusuariomodificacion, FMODIFICACION = @fmodificacion, NCAPACIDADPASAJEROS = @ncapacidadpasajeros, NCAPACIDADCARGA = @ncapacidadcarga, XUSO = @xuso, xtipo = @xtipo, CMONEDA = @cmoneda where CVEHICULOPROPIETARIO = @cvehiculopropietario and CPROPIETARIO = @cpropietario' );
                rowsAffected = rowsAffected + update.rowsAffected;
                if(vehicles[i].images){
                    if(update.rowsAffected > 0 && vehicles[i].images.delete){
                        for(let j = 0; j < vehicles[i].images.delete.length; j++){
                            let subDelete = await pool.request()
                                .input('cvehiculopropietario', sql.Int, vehicles[i].cvehiculopropietario)
                                .input('cimagen', sql.Int, vehicles[i].images.delete[j].cimagen)
                                .query('delete from TRIMAGENVEHICULO where CVEHICULOPROPIETARIO = @cvehiculopropietario and CIMAGEN = @cimagen')
                        }
                    }
                    if(update.rowsAffected > 0 && vehicles[i].images.update){
                        for(let j = 0; j < vehicles[i].images.update.length; j++){
                            let subUpdate = await pool.request()
                                .input('cvehiculopropietario', sql.Int, vehicles[i].cvehiculopropietario)
                                .input('cimagen', sql.Int, vehicles[i].images.update[j].cimagen)
                                .input('xrutaimagen', sql.NVarChar, vehicles[i].images.update[j].xrutaimagen)
                                .input('cusuariomodificacion', sql.Int, ownerData.cusuariomodificacion)
                                .input('fmodificacion', sql.DateTime, new Date())
                                .query('update TRIMAGENVEHICULO set XRUTAIMAGEN = @xrutaimagen, CUSUARIOMODIFICACION = @cusuariomodificacion, FMODIFICACION = @fmodificacion where CVEHICULOPROPIETARIO = @cvehiculopropietario and CIMAGEN = @cimagen')
                        }
                    }
                    if(update.rowsAffected > 0 && vehicles[i].images.create){
                        for(let j = 0; j < vehicles[i].images.create.length; j++){
                            let subInsert = await pool.request()
                                .input('cvehiculopropietario', sql.Int, vehicles[i].cvehiculopropietario)
                                .input('cimagen', sql.Int, vehicles[i].images.create[j].cimagen)
                                .input('xrutaimagen', sql.NVarChar, vehicles[i].images.create[j].xrutaimagen)
                                .input('cusuariocreacion', sql.Int, ownerData.cusuariomodificacion)
                                .input('fcreacion', sql.DateTime, new Date())
                                .query('insert into TRIMAGENVEHICULO (CVEHICULOPROPIETARIO, CIMAGEN, XRUTAIMAGEN, CUSUARIOCREACION, FCREACION) values (@cvehiculopropietario, @cimagen, @xrutaimagen, @cusuariocreacion, @fcreacion)')
                        }
                    }
                }
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    createVehiclesByOwnerUpdateQuery: async(vehicles, ownerData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < vehicles.length; i++){
                let insert = await pool.request()
                    .input('cpropietario', sql.Int, ownerData.cpropietario)
                    .input('cmarca', sql.Int, vehicles[i].cmarca)
                    .input('cmodelo', sql.Int, vehicles[i].cmodelo)
                    .input('xplaca', sql.NVarChar, vehicles[i].xplaca)
                    .input('fano', sql.Numeric(4, 0), vehicles[i].fano)
                    .input('xcolor', sql.NVarChar, vehicles[i].xcolor)
                    .input('nkilometraje', sql.Numeric(11, 2), vehicles[i].nkilometraje)
                    .input('bimportado', sql.Bit, vehicles[i].bimportado)
                    .input('xcertificadoorigen', sql.NVarChar, vehicles[i].xcertificadoorigen)
                    .input('mpreciovehiculo', sql.Numeric(11, 2), vehicles[i].mpreciovehiculo)
                    .input('xserialcarroceria', sql.NVarChar, vehicles[i].xserialcarroceria)
                    .input('xserialmotor', sql.NVarChar, vehicles[i].xserialmotor)
                    .input('cpais', sql.Numeric(4, 0), ownerData.cpais)
                    .input('cusuariocreacion', sql.Int, ownerData.cusuariomodificacion)
                    .input('fcreacion', sql.DateTime, new Date())
                    .input('cmoneda', sql.Int, vehicles[i].cmoneda)
                    .input('xuso', sql.NVarChar, vehicles[i].xuso)
                    .input('xtipo', sql.NVarChar, vehicles[i].xtipo)
                    .input('ncapacidadcarga', sql.Numeric(11, 2), vehicles[i].ncapacidadcarga)
                    .input('ncapacidadpasajeros', sql.Int, vehicles[i].ncapacidadpasajeros)
                    .query('insert into TRVEHICULOPROPIETARIO (CPROPIETARIO, CMARCA, CMODELO, XPLACA, FANO, XCOLOR, NKILOMETRAJE, BIMPORTADO, XCERTIFICADOORIGEN, MPRECIOVEHICULO, XSERIALCARROCERIA, XSERIALMOTOR, CPAIS, CUSUARIOCREACION, FCREACION, NCAPACIDADPASAJEROS, NCAPACIDADCARGA, XUSO, xtipo, CMONEDA) output inserted.CVEHICULOPROPIETARIO values (@cpropietario, @cmarca, @cmodelo, @xplaca, @fano, @xcolor, @nkilometraje, @bimportado, @xcertificadoorigen, @mpreciovehiculo, @xserialcarroceria, @xserialmotor, @cpais, @cusuariocreacion, @fcreacion, @ncapacidadpasajeros, @ncapacidadcarga, @xuso, @xtipo, @cmoneda)')
                    rowsAffected = rowsAffected + insert.rowsAffected;
                if(vehicles[i].images){
                    for(let j = 0; j < vehicles[i].images.length; j++){
                        let subInsert = await pool.request()
                            .input('cvehiculopropietario', sql.Int, insert.recordset[0].CVEHICULOPROPIETARIO)
                            .input('cimagen', sql.Int, vehicles[i].images[j].cimagen)
                            .input('xrutaimagen', sql.NVarChar, vehicles[i].images[j].xrutaimagen)
                            .input('cusuariocreacion', sql.Int, ownerData.cusuariomodificacion)
                            .input('fcreacion', sql.DateTime, new Date())
                            .query('insert into TRIMAGENVEHICULO (CVEHICULOPROPIETARIO, CIMAGEN, XRUTAIMAGEN, CUSUARIOCREACION, FCREACION) values (@cvehiculopropietario, @cimagen, @xrutaimagen, @cusuariocreacion, @fcreacion)')
                    }
                }
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    deleteImagesByOwnerVehicleImageUpdateQuery: async(images, ownerVehicleImageData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < images.length; i++){
                let erase = await pool.request()
                    .input('cvehiculopropietario', sql.Int, ownerVehicleImageData.cvehiculopropietario)
                    .input('cimagen', sql.Int, images[i].cimagen)
                    .query('delete from TRIMAGENVEHICULO where CVEHICULOPROPIETARIO = @cvehiculopropietario and CIMAGEN = @cimagen');
                rowsAffected = rowsAffected + erase.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    updateImagesByOwnerVehicleImageUpdateQuery: async(images, ownerVehicleImageData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < images.length; i++){
                let update = await pool.request()
                    .input('cvehiculopropietario', ownerVehicleImageData.cvehiculopropietario)
                    .input('cimagen', sql.Int, images[i].cimagen)
                    .input('xrutaimagen', sql.NVarChar, images[i].xrutaimagen)
                    .input('cusuariomodificacion', sql.Int, ownerVehicleImageData.cusuariomodificacion)
                    .input('fmodificacion', sql.DateTime, new Date())
                    .query('update TRIMAGENVEHICULO set XRUTAIMAGEN = @xrutaimagen, CUSUARIOMODIFICACION = @cusuariomodificacion, FMODIFICACION = @fmodificacion where CVEHICULOPROPIETARIO = @cvehiculopropietario and CIMAGEN = @cimagen');
                rowsAffected = rowsAffected + update.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    createImagesByOwnerVehicleImageUpdateQuery: async(images, ownerVehicleImageData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < images.length; i++){
                let insert = await pool.request()
                    .input('cvehiculopropietario', sql.Int, ownerVehicleImageData.cvehiculopropietario)
                    .input('cimagen', sql.Int, images[i].cimagen)
                    .input('xrutaimagen', sql.NVarChar, images[i].xrutaimagen)
                    .input('cusuariocreacion', sql.Int, ownerVehicleImageData.cusuariomodificacion)
                    .input('fcreacion', sql.DateTime, new Date())
                    .query('insert into TRIMAGENVEHICULO (CVEHICULOPROPIETARIO, CIMAGEN, XRUTAIMAGEN, CUSUARIOCREACION, FCREACION) values (@cvehiculopropietario, @cimagen, @xrutaimagen, @cusuariocreacion, @fcreacion)')
                rowsAffected = rowsAffected + insert.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    searchImageQuery: async(searchData) => {
        try{
            let query = `select * from MAIMAGEN where CPAIS = @cpais and CCOMPANIA = @ccompania${ searchData.ximagen ? " and XIMAGEN like '%" + searchData.ximagen + "%'" : '' }`;
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cpais', sql.Numeric(4, 0), searchData.cpais)
                .input('ccompania', sql.Int, searchData.ccompania)
                .query(query);
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    verifyImageNameToCreateQuery: async(imageData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('ximagen', sql.NVarChar, imageData.ximagen)
                .input('cpais', sql.Numeric(4, 0), imageData.cpais)
                .input('ccompania', sql.Int, imageData.ccompania)
                .query('select * from MAIMAGEN where XIMAGEN = @ximagen and CPAIS = @cpais and CCOMPANIA = @ccompania');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    createImageQuery: async(imageData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('ximagen', sql.NVarChar, imageData.ximagen)
                .input('bactivo', sql.Bit, imageData.bactivo)
                .input('cpais', sql.Numeric(4, 0), imageData.cpais)
                .input('ccompania', sql.Int, imageData.ccompania)
                .input('cusuariocreacion', sql.Int, imageData.cusuariocreacion)
                .input('fcreacion', sql.DateTime, new Date())
                .query('insert into MAIMAGEN (XIMAGEN, BACTIVO, CPAIS, CCOMPANIA, CUSUARIOCREACION, FCREACION) output inserted.CIMAGEN values (@ximagen, @bactivo, @cpais, @ccompania, @cusuariocreacion, @fcreacion)');
                //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    getImageDataQuery: async(imageData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cimagen', sql.Int, imageData.cimagen)
                .input('cpais', sql.Numeric(4, 0), imageData.cpais)
                .input('ccompania', sql.Int, imageData.ccompania)
                .query('select * from MAIMAGEN where CIMAGEN = @cimagen and CPAIS = @cpais and CCOMPANIA = @ccompania');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    verifyImageNameToUpdateQuery: async(imageData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('ximagen', sql.NVarChar, imageData.ximagen)
                .input('cimagen', sql.Int, imageData.cimagen)
                .input('cpais', sql.Numeric(4, 0), imageData.cpais)
                .input('ccompania', sql.Int, imageData.ccompania)
                .query('select * from MAIMAGEN where XIMAGEN = @ximagen and CPAIS = @cpais and CCOMPANIA = @ccompania and CIMAGEN != @cimagen');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    updateImageQuery: async(imageData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cimagen', sql.Int, imageData.cimagen)
                .input('ximagen', sql.NVarChar, imageData.ximagen)
                .input('bactivo', sql.Bit, imageData.bactivo)
                .input('cpais', sql.Numeric(4, 0), imageData.cpais)
                .input('ccompania', sql.Int, imageData.ccompania)
                .input('cusuariomodificacion', sql.Int, imageData.cusuariomodificacion)
                .input('fmodificacion', sql.DateTime, new Date())
                .query('update MAIMAGEN set XIMAGEN = @ximagen, BACTIVO = @bactivo, CUSUARIOMODIFICACION = @cusuariomodificacion, FMODIFICACION = @fmodificacion where CIMAGEN = @cimagen and CPAIS = @cpais and CCOMPANIA = @ccompania');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    imageValrepQuery: async(searchData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cpais', sql.Numeric(4, 0), searchData.cpais)
                .input('ccompania', sql.Int, searchData.ccompania)
                .query('select CIMAGEN, XIMAGEN, BACTIVO from MAIMAGEN where CPAIS = @cpais and CCOMPANIA = @ccompania');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    getImagesVehicleDataQuery: async(cvehiculopropietario) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cvehiculopropietario', sql.Int, cvehiculopropietario)
                .query('select * from VWBUSCARIMAGENXVEHICULODATA where CVEHICULOPROPIETARIO = @cvehiculopropietario');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    searchPaymentMethodologyQuery: async(searchData) => {
        try{
            let query = `select * from MAMETODOLOGIAPAGO where CPAIS = @cpais and CCOMPANIA = @ccompania${ searchData.xmetodologiapago ? " and XMETODOLOGIAPAGO like '%" + searchData.xmetodologiapago + "%'" : '' }`;
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cpais', sql.Numeric(4, 0), searchData.cpais)
                .input('ccompania', sql.Int, searchData.ccompania)
                .query(query);
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    verifyPaymentMethodologyNameToCreateQuery: async(paymentMethodologyData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('xmetodologiapago', sql.NVarChar, paymentMethodologyData.xmetodologiapago)
                .input('cpais', sql.Numeric(4, 0), paymentMethodologyData.cpais)
                .input('ccompania', sql.Int, paymentMethodologyData.ccompania)
                .query('select * from MAMETODOLOGIAPAGO where XMETODOLOGIAPAGO = @xmetodologiapago and CPAIS = @cpais and CCOMPANIA = @ccompania');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    createPaymentMethodologyQuery: async(paymentMethodologyData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('xmetodologiapago', sql.NVarChar, paymentMethodologyData.xmetodologiapago)
                .input('bactivo', sql.Bit, paymentMethodologyData.bactivo)
                .input('cpais', sql.Numeric(4, 0), paymentMethodologyData.cpais)
                .input('ccompania', sql.Int, paymentMethodologyData.ccompania)
                .input('cusuariocreacion', sql.Int, paymentMethodologyData.cusuariocreacion)
                .input('fcreacion', sql.DateTime, new Date())
                .query('insert into MAMETODOLOGIAPAGO (XMETODOLOGIAPAGO, BACTIVO, CPAIS, CCOMPANIA, CUSUARIOCREACION, FCREACION) output inserted.CMETODOLOGIAPAGO values (@xmetodologiapago, @bactivo, @cpais, @ccompania, @cusuariocreacion, @fcreacion)');
                //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    getPaymentMethodologyDataQuery: async(paymentMethodologyData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cmetodologiapago', sql.Int, paymentMethodologyData.cmetodologiapago)
                .input('cpais', sql.Numeric(4, 0), paymentMethodologyData.cpais)
                .input('ccompania', sql.Int, paymentMethodologyData.ccompania)
                .query('select * from MAMETODOLOGIAPAGO where CMETODOLOGIAPAGO = @cmetodologiapago and CPAIS = @cpais and CCOMPANIA = @ccompania');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    verifyPaymentMethodologyNameToUpdateQuery: async(paymentMethodologyData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('xmetodologiapago', sql.NVarChar, paymentMethodologyData.xmetodologiapago)
                .input('cmetodologiapago', sql.Int, paymentMethodologyData.cmetodologiapago)
                .input('cpais', sql.Numeric(4, 0), paymentMethodologyData.cpais)
                .input('ccompania', sql.Int, paymentMethodologyData.ccompania)
                .query('select * from MAMETODOLOGIAPAGO where XMETODOLOGIAPAGO = @xmetodologiapago and CPAIS = @cpais and CCOMPANIA = @ccompania and CMETODOLOGIAPAGO != @cmetodologiapago');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    updatePaymentMethodologyQuery: async(paymentMethodologyData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cmetodologiapago', sql.Int, paymentMethodologyData.cmetodologiapago)
                .input('xmetodologiapago', sql.NVarChar, paymentMethodologyData.xmetodologiapago)
                .input('bactivo', sql.Bit, paymentMethodologyData.bactivo)
                .input('cpais', sql.Numeric(4, 0), paymentMethodologyData.cpais)
                .input('ccompania', sql.Int, paymentMethodologyData.ccompania)
                .input('cusuariomodificacion', sql.Int, paymentMethodologyData.cusuariomodificacion)
                .input('fmodificacion', sql.DateTime, new Date())
                .query('update MAMETODOLOGIAPAGO set XMETODOLOGIAPAGO = @xmetodologiapago, BACTIVO = @bactivo, CUSUARIOMODIFICACION = @cusuariomodificacion, FMODIFICACION = @fmodificacion where CMETODOLOGIAPAGO = @cmetodologiapago and CPAIS = @cpais and CCOMPANIA = @ccompania');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    paymentMethodologyValrepQuery: async(searchData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cpais', sql.Numeric(4, 0), searchData.cpais)
                .input('ccompania', sql.Int, searchData.ccompania)
                .query('select CMETODOLOGIAPAGO, XMETODOLOGIAPAGO, BACTIVO from MAMETODOLOGIAPAGO where CPAIS = @cpais and CCOMPANIA = @ccompania');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    searchClubContractManagementQuery: async(searchData) => {
        try{
            let query = `select * from VWBUSCARCONTRATOCLUBDATA where CPAIS = @cpais and CCOMPANIA = @ccompania${ searchData.xnombre ? " and XNOMBRE like '%" + searchData.xnombre + "%'" : '' }${ searchData.ctipodocidentidad ? " and CTIPODOCIDENTIDAD = @ctipodocidentidad" : '' }${ searchData.xdocidentidad ? " and XDOCIDENTIDAD like '%" + searchData.xdocidentidad + "%'" : '' }${ searchData.xapellido ? " and XAPELLIDO like '%" + searchData.xapellido + "%'" : '' }${ searchData.cpropietario ? " and CPROPIETARIO = @cpropietario" : '' }`;
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cpais', sql.Numeric(4, 0), searchData.cpais ? searchData.cpais : 1)
                .input('ccompania', sql.Int, searchData.ccompania ? searchData.ccompania : 1)
                .input('ctipodocidentidad', sql.Int, searchData.ctipodocidentidad ? searchData.ctipodocidentidad : 1)
                .input('cpropietario', sql.Int, searchData.cpropietario ? searchData.cpropietario : 1)
                .query(query);
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    searchClubContractManagementByPlateQuery: async(searchData) => {
        try{
            let query = `select * from VWBUSCARCONTRATOCLUBXPLACADATA where XPLACA = @xplaca and CPAIS = @cpais and CCOMPANIA = @ccompania`;
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cpais', sql.Numeric(4, 0), searchData.cpais)
                .input('ccompania', sql.Int, searchData.ccompania)
                .input('xplaca', sql.NVarChar, searchData.xplaca)
                .query(query);
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    planPaymentMethodologyValrepQuery: async(searchData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .query('select CMETODOLOGIAPAGO, XMETODOLOGIAPAGO, BACTIVO from MAMETODOLOGIAPAGO');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    verifyClubContractManagementVehicleToCreateQuery: async(clubContractManagementData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cpais', sql.Numeric(4, 0), clubContractManagementData.cpais)
                .input('ccompania', sql.Int, clubContractManagementData.ccompania)
                .input('cvehiculopropietario', sql.Int, clubContractManagementData.cvehiculopropietario)
                .query('select * from SUCONTRATOCLUB where CVEHICULOPROPIETARIO = @cvehiculopropietario and CPAIS = @cpais and CCOMPANIA = @ccompania');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    createClubContractManagementQuery: async(clubContractManagementData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cpais', sql.Numeric(4, 0), clubContractManagementData.cpais)
                .input('ccompania', sql.Int, clubContractManagementData.ccompania)
                .input('cpropietario', sql.Int, clubContractManagementData.cpropietario)
                .input('cvehiculopropietario', sql.Int, clubContractManagementData.cvehiculopropietario)
                .input('bpropietario', sql.Bit, clubContractManagementData.bpropietario)
                .input('xnombre', sql.NVarChar, clubContractManagementData.xnombre)
                .input('xapellido', sql.NVarChar, clubContractManagementData.xapellido)
                .input('cestadocivil', sql.Int, clubContractManagementData.cestadocivil)
                .input('fnacimiento', sql.DateTime, clubContractManagementData.fnacimiento)
                .input('xprofesion', sql.NVarChar, clubContractManagementData.xprofesion ? clubContractManagementData.xprofesion : null)
                .input('xocupacion', sql.NVarChar, clubContractManagementData.xocupacion ? clubContractManagementData.xocupacion : null)
                .input('ctipodocidentidad', sql.Int, clubContractManagementData.ctipodocidentidad)
                .input('xdocidentidad', sql.NVarChar, clubContractManagementData.xdocidentidad)
                .input('cestado', sql.Int, clubContractManagementData.cestado)
                .input('cciudad', sql.Int, clubContractManagementData.cciudad)
                .input('xdireccion', sql.NVarChar, clubContractManagementData.xdireccion)
                .input('xemail', sql.NVarChar, clubContractManagementData.xemail)
                .input('xtelefonocasa', sql.NVarChar, clubContractManagementData.xtelefonocasa ? clubContractManagementData.xtelefonocasa : null)
                .input('xtelefonocelular', sql.NVarChar, clubContractManagementData.xtelefonocelular)
                .input('xfax', sql.NVarChar, clubContractManagementData.xfax ? clubContractManagementData.xfax : null)
                .input('cparentesco', sql.Int, clubContractManagementData.cparentesco)
                .input('ctipoplan', sql.Int, clubContractManagementData.ctipoplan)
                .input('cplan', sql.Int, clubContractManagementData.cplan)
                .input('cmetodologiapago', sql.Int, clubContractManagementData.cmetodologiapago)
                .input('finicio', sql.DateTime, new Date())
                .input('fvencimiento', sql.DateTime, clubContractManagementData.fvencimiento)
                .input('bactivo', sql.Bit, clubContractManagementData.bactivo)
                .input('cusuariocreacion', sql.Int, clubContractManagementData.cusuariocreacion)
                .input('csexo', sql.Int, clubContractManagementData.csexo)
                .input('xnacionalidad', sql.NVarChar, clubContractManagementData.xnacionalidad)
                .input('fcreacion', sql.DateTime, new Date())
                .input('cprocedencia', sql.Char(3), clubContractManagementData.cprocedencia)
                .query('insert into SUCONTRATOCLUB (CPAIS, CCOMPANIA, CPROPIETARIO, CVEHICULOPROPIETARIO, BPROPIETARIO, XNOMBRE, XAPELLIDO, CESTADOCIVIL, FNACIMIENTO, XPROFESION, XOCUPACION, CTIPODOCIDENTIDAD, XDOCIDENTIDAD, CESTADO, CCIUDAD, XDIRECCION, XEMAIL, XTELEFONOCASA, XTELEFONOCELULAR, XFAX, CPARENTESCO, CTIPOPLAN, CPLAN, CMETODOLOGIAPAGO, FINICIO, FVENCIMIENTO, BACTIVO, CUSUARIOCREACION, FCREACION, CPROCEDENCIA, CSEXO, XNACIONALIDAD) output inserted.CCONTRATOCLUB values (@cpais, @ccompania, @cpropietario, @cvehiculopropietario, @bpropietario, @xnombre, @xapellido, @cestadocivil, @fnacimiento, @xprofesion, @xocupacion, @ctipodocidentidad, @xdocidentidad, @cestado, @cciudad, @xdireccion, @xemail, @xtelefonocasa, @xtelefonocelular, @xfax, @cparentesco, @ctipoplan, @cplan, @cmetodologiapago, @finicio, @fvencimiento, @bactivo, @cusuariocreacion, @fcreacion, @cprocedencia, @csexo, @xnacionalidad)');
            if(result.rowsAffected > 0 && clubContractManagementData.paymentVouchers){
                for(let i = 0; i < clubContractManagementData.paymentVouchers.length; i++){
                    let insert = await pool.request()
                        .input('ccontratoclub', sql.Int, result.recordset[0].CCONTRATOCLUB)
                        .input('ctransaccion', sql.NVarChar, clubContractManagementData.paymentVouchers[i].ctransaccion)
                        .input('creferenciatransaccion', sql.NVarChar, clubContractManagementData.paymentVouchers[i].creferenciatransaccion)
                        .input('cbanco', sql.Int, clubContractManagementData.paymentVouchers[i].cbanco)
                        .input('cusuariocreacion', sql.Int, clubContractManagementData.cusuariocreacion)
                        .input('fcreacion', sql.DateTime, new Date())
                        .query('insert into SUCOMPROBANTEPAGOCONTRATOCLUB (CCONTRATOCLUB, CTRANSACCION, CREFERENCIATRANSACCION, CBANCO, CUSUARIOCREACION, FCREACION) values (@ccontratoclub, @ctransaccion, @creferenciatransaccion, @cbanco, @cusuariocreacion, @fcreacion)')
                }
            }
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    bankValrepQuery: async(searchData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cpais', sql.Numeric(4, 0), searchData.cpais)
                .query('select CBANCO, XBANCO, BACTIVO from MABANCO where CPAIS = @cpais');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    authorizeProviderQuery: async(xemail) =>{
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('xemail', sql.NVarChar, xemail)
                .input('bproveedor', sql.Bit, true)
                .input('bactivo', sql.Bit, true)
                .query('select * from SEUSUARIO where XEMAIL = @xemail and BPROVEEDOR = @bproveedor and BACTIVO = @bactivo');
            //sql.close();
            return { result: result };
        }
        catch(err){
            return { error: err.message};
        }
    },
    providerServiceByPlanValrepQuery: async(searchData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cproveedor', sql.Int, searchData.cproveedor)
                .input('ctiposervicio', sql.Int, searchData.ctiposervicio)
                .input('cplan', sql.Int, searchData.cplan)
                .query('select CSERVICIO, XSERVICIO, SERVICIOACTIVO from VWBUSCARSERVICIOXPROVEEDORXPLANDATA where CTIPOSERVICIO = @ctiposervicio and CPROVEEDOR = @cproveedor and CPLAN = @cplan');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    providerServiceTypeByPlanValrepQuery: async(searchData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cproveedor', sql.Int, searchData.cproveedor)
                .input('cplan', sql.Int, searchData.cplan)
                .query('select DISTINCT CTIPOSERVICIO, XTIPOSERVICIO, TIPOSERVICIOACTIVO from VWBUSCARSERVICIOXPROVEEDORXPLANDATA where CPROVEEDOR = @cproveedor and CPLAN = @cplan');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    getClubContractManagementDataQuery: async(clubContractManagementData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cpais', sql.Numeric(4, 0), clubContractManagementData.cpais)
                .input('ccompania', sql.Int, clubContractManagementData.ccompania)
                .input('ccontratoclub', sql.Int, clubContractManagementData.ccontratoclub)
                .query('select * from VWBUSCARCONTRATOCLUBDATA where CPAIS = @cpais and CCOMPANIA = @ccompania and CCONTRATOCLUB = @ccontratoclub');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    getClubContractManagementPaymentVouchersDataQuery: async(ccontratoclub) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('ccontratoclub', sql.Int, ccontratoclub)
                .query('select * from VWBUSCARCOMPROBANTEPAGOXCONTRATOCLUBDATA where CCONTRATOCLUB = @ccontratoclub');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    verifyClubContractManagementOwnerToUpdateQuery: async(clubContractManagementData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cpais', sql.Numeric(4, 0), clubContractManagementData.cpais)
                .input('ccompania', sql.Int, clubContractManagementData.ccompania)
                .input('ccontratoclub', sql.Int, clubContractManagementData.ccontratoclub)
                .input('cpropietario', sql.Int, clubContractManagementData.cpropietario)
                .query('select * from SUCONTRATOCLUB where CPROPIETARIO = @cpropietario and CPAIS = @cpais and CCOMPANIA = @ccompania and CCONTRATOCLUB != @ccontratoclub');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    updateClubContractManagementQuery: async(clubContractManagementData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cpais', sql.Numeric(4, 0), clubContractManagementData.cpais)
                .input('ccompania', sql.Int, clubContractManagementData.ccompania)
                .input('ccontratoclub', sql.Int, clubContractManagementData.ccontratoclub)
                .input('cpropietario', sql.Int, clubContractManagementData.cpropietario)
                .input('fvencimiento', sql.DateTime, clubContractManagementData.fvencimiento)
                .input('frenovacion', sql.DateTime, clubContractManagementData.frenovacion ? clubContractManagementData.frenovacion : null)
                .input('ctipoplan', sql.Int, clubContractManagementData.ctipoplan)
                .input('cplan', sql.Int, clubContractManagementData.cplan)
                .input('cmetodologiapago', sql.Int, clubContractManagementData.cmetodologiapago)
                .input('bactivo', sql.Bit, clubContractManagementData.bactivo)
                .input('cusuariomodificacion', sql.Int, clubContractManagementData.cusuariomodificacion)
                .input('fmodificacion', sql.DateTime, new Date())
                .query('update SUCONTRATOCLUB set CPROPIETARIO = @cpropietario, FVENCIMIENTO = @fvencimiento, FRENOVACION = @frenovacion, CTIPOPLAN = @ctipoplan, CPLAN = @cplan, CMETODOLOGIAPAGO = @cmetodologiapago, BACTIVO = @bactivo, CUSUARIOMODIFICACION = @cusuariomodificacion, FMODIFICACION = @fmodificacion where CCONTRATOCLUB = @ccontratoclub and CPAIS = @cpais and CCOMPANIA = @ccompania');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    deletePaymentVouchersByClubContractManagementUpdateQuery: async(paymentVouchers, clubContractManagementData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < paymentVouchers.length; i++){
                let erase = await pool.request()
                    .input('ccontratoclub', sql.Int, clubContractManagementData.ccontratoclub)
                    .input('ccomprobantepago', sql.Int, paymentVouchers[i].ccomprobantepago)
                    .query('delete from SUCOMPROBANTEPAGOCONTRATOCLUB where CCOMPROBANTEPAGO = @ccomprobantepago and CCONTRATOCLUB = @ccontratoclub');
                rowsAffected = rowsAffected + erase.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    updatePaymentVouchersByClubContractManagementUpdateQuery: async(paymentVouchers, clubContractManagementData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < paymentVouchers.length; i++){
                let update = await pool.request()
                    .input('ccontratoclub', sql.Int, clubContractManagementData.ccontratoclub)
                    .input('ccomprobantepago', sql.Int, paymentVouchers[i].ccomprobantepago)
                    .input('cbanco', sql.Int, paymentVouchers[i].cbanco)
                    .input('ctransaccion', sql.NVarChar, paymentVouchers[i].ctransaccion)
                    .input('creferenciatransaccion', sql.NVarChar, paymentVouchers[i].creferenciatransaccion)
                    .input('cusuariomodificacion', sql.Int, clubContractManagementData.cusuariomodificacion)
                    .input('fmodificacion', sql.DateTime, new Date())
                    .query('update SUCOMPROBANTEPAGOCONTRATOCLUB set CTRANSACCION = @ctransaccion, CREFERENCIATRANSACCION = @creferenciatransaccion, CBANCO = @cbanco, CUSUARIOMODIFICACION = @cusuariomodificacion, FMODIFICACION = @fmodificacion where CCOMPROBANTEPAGO = @ccomprobantepago and CCONTRATOCLUB = @ccontratoclub');
                rowsAffected = rowsAffected + update.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    createPaymentVouchersByClubContractManagementUpdateQuery: async(paymentVouchers, clubContractManagementData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < paymentVouchers.length; i++){
                let insert = await pool.request()
                    .input('ccontratoclub', sql.Int, clubContractManagementData.ccontratoclub)
                    .input('cbanco', sql.Int, paymentVouchers[i].cbanco)
                    .input('ctransaccion', sql.NVarChar, paymentVouchers[i].ctransaccion)
                    .input('creferenciatransaccion', sql.NVarChar, paymentVouchers[i].creferenciatransaccion)
                    .input('cusuariocreacion', sql.Int, clubContractManagementData.cusuariomodificacion)
                    .input('fcreacion', sql.DateTime, new Date())
                    .query('insert into SUCOMPROBANTEPAGOCONTRATOCLUB (CCONTRATOCLUB, CBANCO, CTRANSACCION, CREFERENCIATRANSACCION, CUSUARIOCREACION, FCREACION) values (@ccontratoclub, @cbanco, @ctransaccion, @creferenciatransaccion, @cusuariocreacion, @fcreacion)')
                rowsAffected = rowsAffected + insert.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    providerAuthorizationQuery: async(xemail) =>{
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('xemail', sql.NVarChar, xemail)
                .input('bactivo', sql.Bit, true)
                .query('select * from SEUSUARIOCLUB where XEMAIL = @xemail and BACTIVO = @bactivo and CROLCLUB = \'PRV\'');
            //sql.close();
            return { result: result };
        }
        catch(err){
            return { error: err.message};
        }
    },
    getProviderDataQuery: async(providerData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                //.input('cpais', sql.Numeric(4, 0), providerData.cpais)
                .input('ccompania', sql.Int, providerData.ccompania)
                .input('cproveedor', sql.Int, providerData.cproveedor)
                .query('select * from prproveedores where CPROVEEDOR = @cproveedor and CCOMPANIA = @ccompania');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    getProviderBanksDataQuery: async(cproveedor) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cproveedor', sql.Int, cproveedor)
                .query('select * from VWBUSCARBANCOXPROVEEDORDATA where CPROVEEDOR = @cproveedor');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    getProviderStatesDataQuery: async(cproveedor) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cproveedor', sql.Int, cproveedor)
                .query('select * from VWBUSCARESTADOXPROVEEDORDATA where CPROVEEDOR = @cproveedor');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    getProviderBrandsDataQuery: async(cproveedor) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cproveedor', sql.Int, cproveedor)
                .query('select * from VWBUSCARMARCAXPROVEEDORDATA where CPROVEEDOR = @cproveedor');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    getProviderServicesDataQuery: async(cproveedor) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cproveedor', sql.Int, cproveedor)
                .query('select * from VWBUSCARSERVICIOXPROVEEDORDATA where CPROVEEDOR = @cproveedor');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    getProviderContactsDataQuery: async(cproveedor) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cproveedor', sql.Int, cproveedor)
                .query('select * from PRCONTACTO where CPROVEEDOR = @cproveedor');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    searchOwnerPlateQuery: async(searchData) => {
        try{
            let query = `select * from VWBUSCARPLACAXPAISDATA where XPLACA = @xplaca and CPAIS = @cpais`;
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cpais', sql.Numeric(4, 0), searchData.cpais)
                .input('xplaca', sql.NVarChar, searchData.xplaca)
                .query(query);
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    searchOwnerVehicleQuery: async(searchData) => {
        try{
            let query = `select * from VWBUSCARVEHICULOXPROPIETARIODATA where CPROPIETARIO = @cpropietario${ searchData.cmarca ? " and CMARCA = @cmarca" : '' }${ searchData.cmodelo ? " and CMODELO = @cmodelo" : '' }${ searchData.cversion ? " and CVERSION = @cversion" : '' }${ searchData.xplaca ? " and XPLACA like '%" + searchData.xplaca + "%'" : '' }`;
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cpropietario', sql.Int, searchData.cpropietario ? searchData.cpropietario : 1)
                .input('cmarca', sql.Int, searchData.cmarca ? searchData.cmarca : 1)
                .input('cmodelo', sql.Int, searchData.cmodelo ? searchData.cmodelo : 1)
                .input('cversion', sql.Int, searchData.cversion ? searchData.cversion : 1)
                .input('xplaca', sql.NVarChar, searchData.xplaca ? searchData.xplaca : 1)
                .query(query);
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    getRequestedServiceDataQuery: async(serviceRequestData, cplan) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('ctiposervicio', sql.Int, serviceRequestData.ctiposervicio)
                .input('cservicio', sql.Int, serviceRequestData.cservicio)
                .input('cplan', sql.Int, cplan)
                .query('select * from POSERVICIOPLAN where CTIPOSERVICIO = @ctiposervicio and CSERVICIO = @cservicio and CPLAN = @cplan');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    getServiceRequestQuantityQuery: async(serviceRequestData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('ccontratoclub', sql.Int, serviceRequestData.ccontratoclub)
                .input('cpais', sql.Numeric(4, 0), serviceRequestData.cpais)
                .input('ccompania', sql.Int, serviceRequestData.ccompania)
                .input('ctiposervicio', sql.Int, serviceRequestData.ctiposervicio)
                .input('cservicio', sql.Int, serviceRequestData.cservicio)
                .query('select * from EVSOLICITUDSERVICIO where CCONTRATOCLUB = @ccontratoclub and CPAIS = @cpais and CCOMPANIA = @ccompania and CTIPOSERVICIO = @ctiposervicio and CSERVICIO = @cservicio');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        } 
    },
    createServiceRequestQuery: async(serviceRequestData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cpais', sql.Numeric(4, 0), serviceRequestData.cpais)
                .input('ccompania', sql.Int, serviceRequestData.ccompania)
                .input('fgestion', sql.DateTime, serviceRequestData.fgestion)
                .input('isolicitante', sql.Char(3), serviceRequestData.isolicitante)
                .input('ccontratoclub', sql.Int, serviceRequestData.ccontratoclub)
                .input('cproveedor', sql.Int, serviceRequestData.cproveedor)
                .input('ctiposervicio', sql.Int, serviceRequestData.ctiposervicio)
                .input('cservicio', sql.Int, serviceRequestData.cservicio)
                .input('bcubierto', sql.Bit, serviceRequestData.bcubierto)
                .input('bactivo', sql.Bit, serviceRequestData.bactivo)
                .input('cusuariocreacion', sql.Int, serviceRequestData.cusuariocreacion)
                .input('fcreacion', sql.DateTime, new Date())
                .input('cprocedencia', sql.Char(3), serviceRequestData.cprocedencia)
                .query('insert into EVSOLICITUDSERVICIO (CPAIS, CCOMPANIA, FGESTION, ISOLICITANTE, CCONTRATOCLUB, CPROVEEDOR, CTIPOSERVICIO, CSERVICIO, BCUBIERTO, BACTIVO, CUSUARIOCREACION, FCREACION, CPROCEDENCIA) output inserted.CSOLICITUDSERVICIO values (@cpais, @ccompania, @fgestion, @isolicitante, @ccontratoclub, @cproveedor, @ctiposervicio, @cservicio, @bcubierto, @bactivo, @cusuariocreacion, @fcreacion, @cprocedencia)');
            if(serviceRequestData.cprocedencia == 'PRO'){
                let insertSecond = await pool.request()
                    .input('csolicitudservicio', sql.Int, result.recordset[0].CSOLICITUDSERVICIO)
                    .input('ctiposeguimiento', sql.Int, serviceRequestData.ctiposeguimiento)
                    .input('cmotivoseguimiento', sql.Int, serviceRequestData.cmotivoseguimiento)
                    .input('fseguimientosolicitudservicio', sql.DateTime, serviceRequestData.fseguimientosolicitudservicio)
                    .input('bcerrado', sql.Bit, false)
                    .input('cusuariocreacion', sql.Int, serviceRequestData.cusuariocreacion)
                    .input('fcreacion', sql.DateTime, new Date())
                    .query('insert into EVSEGUIMIENTOSOLICITUDSERVICIO (CSOLICITUDSERVICIO, CTIPOSEGUIMIENTO, CMOTIVOSEGUIMIENTO, FSEGUIMIENTOSOLICITUDSERVICIO, BCERRADO, CUSUARIOCREACION, FCREACION) values (@csolicitudservicio, @ctiposeguimiento, @cmotivoseguimiento, @fseguimientosolicitudservicio, @bcerrado, @cusuariocreacion, @fcreacion)')
            }
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        } 
    },
    planServiceTypeValrepQuery: async(cplan) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cplan', sql.Int, cplan)
                .query('select DISTINCT CTIPOSERVICIO, XTIPOSERVICIO, TIPOSERVICIOACTIVO from VWBUSCARSERVICIOXPLANDATA where CPLAN = @cplan');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    planServiceValrepQuery: async(searchData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cplan', sql.Int, searchData.cplan)
                .input('ctiposervicio', sql.Int, searchData.ctiposervicio)
                .query('select * from VWBUSCARSERVICIOXPLANDATA where CPLAN = @cplan and CTIPOSERVICIO = @ctiposervicio' );
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    searchServiceRequestQuery: async(searchData) => {
        try{
            let query = `select * from VWBUSCARSOLICITUDSERVICIODATA where CPAIS = @cpais and CCOMPANIA = @ccompania${ searchData.ctipodocidentidad ? " and CTIPODOCIDENTIDAD = @ctipodocidentidad" : '' }${ searchData.isolicitante ? " and ISOLICITANTE = @isolicitante" : '' }${ searchData.xnombre ? " and XNOMBRE like '%" + searchData.xnombre + "%'" : '' }${ searchData.xapellido ? " and XAPELLIDO like '%" + searchData.xapellido + "%'" : '' }${ searchData.xdocidentidad ? " and XDOCIDENTIDAD like '%" + searchData.xdocidentidad + "%'" : '' }`;
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cpais', sql.Numeric(4, 0), searchData.cpais)
                .input('ccompania', sql.Int, searchData.ccompania)
                .input('ctipodocidentidad', sql.Int, searchData.ctipodocidentidad ? searchData.ctipodocidentidad : 1)
                .input('isolicitante', sql.Char(3), searchData.isolicitante ? searchData.isolicitante : 'TST')
                .input('xdocidentidad', sql.NVarChar, searchData.xdocidentidad ? searchData.xdocidentidad : 1)
                .query(query);
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    searchServiceRequestProviderQuery: async(searchData) => {
        try{
            let query = `select DISTINCT CPROVEEDOR, XPROVEEDOR, XRAZONSOCIAL, XEMAIL, XESTADO, XCIUDAD, XDIRECCION, BACTIVO from VWBUSCARPROVEEDORXSOLICITUDSERVICIODATA where CPAIS = @cpais and CCOMPANIA = @ccompania and CESTADO = @cestado and CCIUDAD = @cciudad and CTIPOSERVICIO = @ctiposervicio and CSERVICIO = @cservicio`;
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cpais', sql.Numeric(4, 0), searchData.cpais)
                .input('ccompania', sql.Int, searchData.ccompania)
                .input('cestado', sql.Int, searchData.cestado)
                .input('cciudad', sql.Int, searchData.cciudad)
                .input('ctiposervicio', sql.Int, searchData.ctiposervicio)
                .input('cservicio', sql.Int, searchData.cservicio)
                .query(query);
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    getServiceRequestDataQuery: async(serviceRequestData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cpais', sql.Numeric(4, 0), serviceRequestData.cpais)
                .input('ccompania', sql.Int, serviceRequestData.ccompania)
                .input('csolicitudservicio', sql.Int, serviceRequestData.csolicitudservicio)
                .query('select * from VWBUSCARSOLICITUDSERVICIODATA where CPAIS = @cpais and CCOMPANIA = @ccompania and CSOLICITUDSERVICIO = @csolicitudservicio');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    updateServiceRequestQuery: async(serviceRequestData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cpais', sql.Numeric(4, 0), serviceRequestData.cpais)
                .input('ccompania', sql.Int, serviceRequestData.ccompania)
                .input('csolicitudservicio', sql.Int, serviceRequestData.csolicitudservicio)
                .input('ccontratoclub', sql.Int, serviceRequestData.ccontratoclub)
                .input('cproveedor', sql.Int, serviceRequestData.cproveedor)
                .input('fgestion', sql.DateTime, serviceRequestData.fgestion ? serviceRequestData.fgestion : null)
                .input('ctiposervicio', sql.Int, serviceRequestData.ctiposervicio)
                .input('cservicio', sql.Int, serviceRequestData.cservicio)
                .input('cusuariomodificacion', sql.Int, serviceRequestData.cusuariomodificacion)
                .input('fmodificacion', sql.DateTime, new Date())
                .query('update EVSOLICITUDSERVICIO set CCONTRATOCLUB = @ccontratoclub, FGESTION = @fgestion, CPROVEEDOR = @cproveedor, CTIPOSERVICIO = @ctiposervicio, CSERVICIO = @cservicio, CUSUARIOMODIFICACION = @cusuariomodificacion, FMODIFICACION = @fmodificacion where CSOLICITUDSERVICIO = @csolicitudservicio and CPAIS = @cpais and CCOMPANIA = @ccompania');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    getServiceRequestTracingsDataQuery: async(csolicitudservicio) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('csolicitudservicio', sql.Int, csolicitudservicio)
                .query('select * from VWBUSCARSEGUIMIENTOXSOLICITUDSERVICIODATA where CSOLICITUDSERVICIO = @csolicitudservicio');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    updateTracingsByServiceRequestUpdateQuery: async(tracings, serviceRequestData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < tracings.length; i++){
                let update = await pool.request()
                    .input('csolicitudservicio', sql.Int, serviceRequestData.csolicitudservicio)
                    .input('cseguimientosolicitudservicio', sql.Int, tracings[i].cseguimientosolicitudservicio)
                    .input('ctiposeguimiento', sql.Int, tracings[i].ctiposeguimiento)
                    .input('cmotivoseguimiento', sql.Int, tracings[i].cmotivoseguimiento)
                    .input('xobservacion', sql.NVarChar, tracings[i].xobservacion ? tracings[i].xobservacion : null)
                    .input('bcerrado', sql.Bit, tracings[i].bcerrado)
                    .input('cusuariomodificacion', sql.Int, serviceRequestData.cusuariomodificacion)
                    .input('fmodificacion', sql.DateTime, new Date())
                    .query('update EVSEGUIMIENTOSOLICITUDSERVICIO set CTIPOSEGUIMIENTO = @ctiposeguimiento, CMOTIVOSEGUIMIENTO = @cmotivoseguimiento, XOBSERVACION = @xobservacion, BCERRADO = @bcerrado, CUSUARIOMODIFICACION = @cusuariomodificacion, FMODIFICACION = @fmodificacion where CSEGUIMIENTOSOLICITUDSERVICIO = @cseguimientosolicitudservicio and CSOLICITUDSERVICIO = @csolicitudservicio');
                rowsAffected = rowsAffected + update.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    closeTracingsByServiceRequestUpdateQuery: async(serviceRequestData) => {
        try{
            let pool = await sql.connect(config);
            let update = await pool.request()
                .input('csolicitudservicio', sql.Int, serviceRequestData.csolicitudservicio)
                .input('bcerrado', sql.Bit, true)
                .input('cusuariomodificacion', sql.Int, serviceRequestData.cusuariomodificacion)
                .input('fmodificacion', sql.DateTime, new Date())
                .query('update EVSEGUIMIENTOSOLICITUDSERVICIO set BCERRADO = @bcerrado, CUSUARIOMODIFICACION = @cusuariomodificacion, FMODIFICACION = @fmodificacion where CSOLICITUDSERVICIO = @csolicitudservicio');

            //sql.close();
            return { result: update };
        }
        catch(err){
            return { error: err.message };
        }
    },
    createTracingsByServiceRequestUpdateQuery: async(tracings, serviceRequestData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < tracings.length; i++){
                let insert = await pool.request()
                    .input('csolicitudservicio', sql.Int, serviceRequestData.csolicitudservicio)
                    .input('ctiposeguimiento', sql.Int, tracings[i].ctiposeguimiento)
                    .input('cmotivoseguimiento', sql.Int, tracings[i].cmotivoseguimiento)
                    .input('fseguimientosolicitudservicio', sql.DateTime, tracings[i].fseguimientosolicitudservicio)
                    .input('bcerrado', sql.Bit, false)
                    .input('cusuariocreacion', sql.Int, serviceRequestData.cusuariomodificacion)
                    .input('fcreacion', sql.DateTime, new Date())
                    .query('insert into EVSEGUIMIENTOSOLICITUDSERVICIO (CSOLICITUDSERVICIO, CTIPOSEGUIMIENTO, CMOTIVOSEGUIMIENTO, FSEGUIMIENTOSOLICITUDSERVICIO, BCERRADO, CUSUARIOCREACION, FCREACION) values (@csolicitudservicio, @ctiposeguimiento, @cmotivoseguimiento, @fseguimientosolicitudservicio, @bcerrado, @cusuariocreacion, @fcreacion)')
                rowsAffected = rowsAffected + insert.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    verifyOwnerExistQuery: async(ownerVehicleData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cpais', sql.Numeric(4, 0), ownerVehicleData.cpais)
                .input('ccompania', sql.Int, ownerVehicleData.ccompania)
                .input('cpropietario', sql.Int, ownerVehicleData.cpropietario)
                .query('select * from TRPROPIETARIO where CPROPIETARIO = @cpropietario and CPAIS = @cpais and CCOMPANIA = @ccompania');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    verifyOwnerVehicleExistQuery: async(ownerVehicleImageData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cpropietario', sql.Int, ownerVehicleImageData.cpropietario)
                .input('cvehiculopropietario', sql.Int, ownerVehicleImageData.cvehiculopropietario)
                .query('select * from TRVEHICULOPROPIETARIO where CPROPIETARIO = @cpropietario and CVEHICULOPROPIETARIO = @cvehiculopropietario');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    createOwnerVehicleQuery: async(ownerVehicleData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cpropietario', sql.Int, ownerVehicleData.cpropietario)
                .input('cmarca', sql.Int, ownerVehicleData.cmarca)
                .input('cmodelo', sql.Int, ownerVehicleData.cmodelo)
                .input('cversion', sql.Int, ownerVehicleData.cversion)
                .input('xplaca', sql.NVarChar, ownerVehicleData.xplaca)
                .input('fano', sql.Numeric(4, 0), ownerVehicleData.fano)
                .input('xcolor', sql.NVarChar, ownerVehicleData.xcolor)
                .input('nkilometraje', sql.Numeric(11, 2), ownerVehicleData.nkilometraje)
                .input('bimportado', sql.Bit, ownerVehicleData.bimportado)
                .input('xcertificadoorigen', sql.NVarChar, ownerVehicleData.xcertificadoorigen)
                .input('mpreciovehiculo', sql.Numeric(11, 2), ownerVehicleData.mpreciovehiculo)
                .input('xserialcarroceria', sql.NVarChar, ownerVehicleData.xserialcarroceria)
                .input('xserialmotor', sql.NVarChar, ownerVehicleData.xserialmotor)
                .input('cpais', sql.Numeric(4, 0), ownerVehicleData.cpais)
                .input('xuso', sql.NVarChar, ownerVehicleData.xuso)
                .input('xtipo', sql.NVarChar, ownerVehicleData.xtipo)
                .input('ncapacidadcarga', sql.Numeric(11, 2), ownerVehicleData.ncapacidadcarga)
                .input('ncapacidadpasajeros', sql.Int, ownerVehicleData.ncapacidadpasajeros)
                .input('cusuariocreacion', sql.Int, ownerVehicleData.cusuariocreacion)
                .input('fcreacion', sql.DateTime, new Date())
                .query('insert into TRVEHICULOPROPIETARIO (CPROPIETARIO, CMARCA, CMODELO, CVERSION, XPLACA, FANO, XCOLOR, NKILOMETRAJE, BIMPORTADO, XCERTIFICADOORIGEN, MPRECIOVEHICULO, XSERIALCARROCERIA, XSERIALMOTOR, CPAIS, CUSUARIOCREACION, FCREACION, NCAPACIDADPASAJEROS, NCAPACIDADCARGA, XUSO, xtipo, CMONEDA) output inserted.CVEHICULOPROPIETARIO values (@cpropietario, @cmarca, @cmodelo, @cversion, @xplaca, @fano, @xcolor, @nkilometraje, @bimportado, @xcertificadoorigen, @mpreciovehiculo, @xserialcarroceria, @xserialmotor, @cpais, @cusuariocreacion, @fcreacion, @ncapacidadpasajeros, @ncapacidadcarga, @xuso, @xtipo, @cmoneda)');
            if(result.rowsAffected > 0 && ownerVehicleData.images){
                for(let i = 0; i < ownerVehicleData.images.length; i++){
                    let insert = await pool.request()
                        .input('cvehiculopropietario', sql.Int, result.recordset[0].CVEHICULOPROPIETARIO)
                        .input('cimagen', sql.Int, ownerVehicleData.images[i].cimagen)
                        .input('xrutaimagen', sql.NVarChar, ownerVehicleData.images[i].xrutaimagen)
                        .input('cusuariocreacion', sql.Int, ownerVehicleData.cusuariocreacion)
                        .input('fcreacion', sql.DateTime, new Date())
                        .query('insert into TRIMAGENVEHICULO (CVEHICULOPROPIETARIO, CIMAGEN, XRUTAIMAGEN, CUSUARIOCREACION, FCREACION) values (@cvehiculopropietario, @cimagen, @xrutaimagen, @cusuariocreacion, @fcreacion)')
                }
            }
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    verifyOwnerHasClubAccountQuery: async(clubContractManagementData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cpais', sql.Numeric(4, 0), clubContractManagementData.cpais)
                .input('ccompania', sql.Int, clubContractManagementData.ccompania)
                .input('cpropietario', sql.Int, clubContractManagementData.cpropietario)
                .query('select * from SEUSUARIOCLUB where CPROPIETARIO = @cpropietario and CPAIS = @cpais and CCOMPANIA = @ccompania');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    verifyDriverHasClubAccountQuery: async(clubContractManagementData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cpais', sql.Numeric(4, 0), clubContractManagementData.cpais)
                .input('ccompania', sql.Int, clubContractManagementData.ccompania)
                .input('cpropietario', sql.Int, clubContractManagementData.cpropietario)
                .input('ctipodocidentidad', sql.Int, clubContractManagementData.ctipodocidentidad)
                .input('xdocidentidad', sql.NVarChar, clubContractManagementData.xdocidentidad)
                .query('select * from SEUSUARIOCLUB where CPROPIETARIO = @cpropietario and CTIPODOCIDENTIDAD = @ctipodocidentidad and XDOCIDENTIDAD = @xdocidentidad and CPAIS = @cpais and CCOMPANIA = @ccompania');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    verifyEmailHasAccountQuery: async(xemail) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('xemail', sql.NVarChar, xemail)
                .query('select * from SEUSUARIOCLUB where XEMAIL = @xemail');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    createClubAccountQuery: async(clubContractManagementData, ccontratoclub, crolclub) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('ccontratoclub', sql.Int, ccontratoclub)
                .input('cpropietario', sql.Int, clubContractManagementData.cpropietario)
                .input('ctipodocidentidad', sql.Int, clubContractManagementData.ctipodocidentidad)
                .input('xdocidentidad', sql.NVarChar, clubContractManagementData.xdocidentidad)
                .input('xemail', sql.NVarChar, clubContractManagementData.xemail)
                .input('xcontrasena', sql.NVarChar, clubContractManagementData.xcontrasena)
                .input('crolclub', sql.Char(3), crolclub)
                .input('bactivo', sql.Bit, clubContractManagementData.bactivo)
                .input('cpais', sql.Numeric(4, 0), clubContractManagementData.cpais)
                .input('ccompania', sql.Int, clubContractManagementData.ccompania)
                .input('cusuariocreacion', sql.Int, clubContractManagementData.cusuariocreacion)
                .input('fcreacion', sql.DateTime, new Date())
                .query('insert into SEUSUARIOCLUB (CCONTRATOCLUB, CPROPIETARIO, CTIPODOCIDENTIDAD, XDOCIDENTIDAD, XEMAIL, XCONTRASENA, CROLCLUB, BACTIVO, CPAIS, CCOMPANIA, CUSUARIOCREACION, FCREACION) output inserted.CUSUARIOCLUB values (@ccontratoclub, @cpropietario, @ctipodocidentidad, @xdocidentidad, @xemail, @xcontrasena, @crolclub, @bactivo, @cpais, @ccompania, @cusuariocreacion, @fcreacion)');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    clientAuthorizationQuery: async(xemail) =>{
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('xemail', sql.NVarChar, xemail)
                .input('bactivo', sql.Bit, true)
                .query('select * from SEUSUARIOCLUB where XEMAIL = @xemail and BACTIVO = @bactivo and CROLCLUB != \'PRV\'');
            //sql.close();
            return { result: result };
        }
        catch(err){
            return { error: err.message};
        }
    },
    searchClubMenuQuery: async(searchData) => {
        try{
            let query = `select * from VWBUSCARMENUCLUBDATA where CMENUCLUB != 0${ searchData.cpais ? ' and CPAIS = @cpais' : '' }${ searchData.ccompania ? ' and CCOMPANIA = @ccompania' : '' }${ searchData.xmenuclub ? " and XMENUCLUB like '%" + searchData.xmenuclub + "%'" : '' }`;
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cpais', sql.Numeric(4, 0), searchData.cpais ? searchData.cpais : 1)
                .input('ccompania', sql.Int, searchData.ccompania ? searchData.ccompania : 1)
                .input('xmenuclub', sql.NVarChar, searchData.xmenuclub ? searchData.xmenuclub : null)
                .query(query);
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    verifyClubMenuNameToCreateQuery: async(clubMenuData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cpais', sql.Numeric(4, 0), clubMenuData.cpais)
                .input('ccompania', sql.Int, clubMenuData.ccompania)
                .input('xmenuclub', sql.NVarChar, clubMenuData.xmenuclub)
                .query('select * from APMENUCLUB where XMENUCLUB = @xmenuclub and CPAIS = @cpais and CCOMPANIA = @ccompania');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    createClubMenuQuery: async(clubMenuData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('xmenuclub', sql.NVarChar, clubMenuData.xmenuclub)
                .input('xcomponente', sql.NVarChar, clubMenuData.xcomponente ? clubMenuData.xcomponente : null)
                .input('xcontenido', sql.NVarChar, clubMenuData.xcontenido)
                .input('bsubmenu', sql.Bit, clubMenuData.bsubmenu)
                .input('bactivo', sql.Bit, clubMenuData.bactivo)
                .input('cpais', sql.Numeric(4, 0), clubMenuData.cpais)
                .input('ccompania', sql.Int, clubMenuData.ccompania)
                .input('cusuariocreacion', sql.Int, clubMenuData.cusuariocreacion)
                .input('fcreacion', sql.DateTime, new Date())
                .query('insert into APMENUCLUB (XMENUCLUB, XCOMPONENTE, XCONTENIDO, BSUBMENU, BACTIVO, CPAIS, CCOMPANIA, CUSUARIOCREACION, FCREACION) output inserted.CMENUCLUB values (@xmenuclub, @xcomponente, @xcontenido, @bsubmenu, @bactivo, @cpais, @ccompania, @cusuariocreacion, @fcreacion)');
                if(result.rowsAffected > 0 && clubMenuData.submenus){
                    for(let i = 0; i < clubMenuData.submenus.length; i++){
                        let insert = await pool.request()
                            .input('cmenuclub', sql.Int, result.recordset[0].CMENUCLUB)
                            .input('xsubmenuclub', sql.NVarChar, clubMenuData.submenus[i].xsubmenuclub)
                            .input('xcomponente', sql.NVarChar, clubMenuData.submenus[i].xcomponente)
                            .input('xcontenido', sql.NVarChar, clubMenuData.submenus[i].xcontenido)
                            .input('bactivo', sql.Bit, clubMenuData.submenus[i].bactivo)
                            .input('cusuariocreacion', sql.Int, clubMenuData.cusuariocreacion)
                            .input('fcreacion', sql.DateTime, new Date())
                            .query('insert into APSUBMENUCLUB (CMENUCLUB, XSUBMENUCLUB, XCOMPONENTE, XCONTENIDO, BACTIVO, CUSUARIOCREACION, FCREACION) values (@cmenuclub, @xsubmenuclub, @xcomponente, @xcontenido, @bactivo, @cusuariocreacion, @fcreacion)')
                    }
                }
                //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    getClubMenuDataQuery: async(cmenuclub) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cmenuclub', sql.Int, cmenuclub)
                .query('select * from APMENUCLUB where CMENUCLUB = @cmenuclub');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    getClubMenuSubMenusDataQuery: async(cmenuclub) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cmenuclub', sql.Int, cmenuclub)
                .query('select * from APSUBMENUCLUB where CMENUCLUB = @cmenuclub');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    verifyClubMenuNameToUpdateQuery: async(clubMenuData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cmenuclub', sql.Int, clubMenuData.cmenuclub)
                .input('xmenuclub', sql.NVarChar, clubMenuData.xclubmenu)
                .input('cpais', sql.Numeric(4, 0), clubMenuData.cpais)
                .input('ccompania', sql.Int, clubMenuData.ccompania)
                .query('select * from APMENUCLUB where XMENUCLUB = @xmenuclub and CPAIS = @cpais and CCOMPANIA = @ccompania and CMENUCLUB != @cmenuclub');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    updateClubMenuQuery: async(clubMenuData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cmenuclub', sql.Int, clubMenuData.cmenuclub)
                .input('xmenuclub', sql.NVarChar, clubMenuData.xmenuclub)
                .input('xcomponente', sql.NVarChar, clubMenuData.xcomponente ? clubMenuData.xcomponente : null)
                .input('xcontenido', sql.NVarChar, clubMenuData.xcontenido)
                .input('bsubmenu', sql.Bit, clubMenuData.bsubmenu)
                .input('bactivo', sql.Bit, clubMenuData.bactivo)
                .input('cpais', sql.Numeric(4, 0), clubMenuData.cpais)
                .input('ccompania', sql.Int, clubMenuData.ccompania)
                .input('cusuariomodificacion', sql.Int, clubMenuData.cusuariomodificacion)
                .input('fmodificacion', sql.DateTime, new Date())
                .query('update APMENUCLUB set XMENUCLUB = @xmenuclub, XCOMPONENTE = @xcomponente, XCONTENIDO = @xcontenido, BSUBMENU = @bsubmenu, BACTIVO = @bactivo, CPAIS = @cpais, CCOMPANIA = @ccompania, CUSUARIOMODIFICACION = @cusuariomodificacion, FMODIFICACION = @fmodificacion where CMENUCLUB = @cmenuclub');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    deleteSubMenusByClubMenuUpdateQuery: async(submenus, clubMenuData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < submenus.length; i++){
                let erase = await pool.request()
                    .input('cmenuclub', sql.Int, clubMenuData.cmenuclub)
                    .input('csubmenuclub', sql.Int, submenus[i].csubmenuclub)
                    .query('delete from APSUBMENUCLUB where CMENUCLUB = @cmenuclub and CSUBMENUCLUB = @csubmenuclub');
                rowsAffected = rowsAffected + erase.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    createSubMenusByClubMenuUpdateQuery: async(submenus, clubMenuData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < submenus.length; i++){
                let insert = await pool.request()
                    .input('cmenuclub', sql.Int, clubMenuData.cmenuclub)
                    .input('xsubmenuclub', sql.NVarChar, submenus[i].xsubmenuclub)
                    .input('xcomponente', sql.NVarChar, submenus[i].xcomponente)
                    .input('xcontenido', sql.NVarChar, submenus[i].xcontenido)
                    .input('bactivo', sql.Bit, submenus[i].bactivo)
                    .input('cusuariocreacion', sql.Int, clubMenuData.cusuariomodificacion)
                    .input('fcreacion', sql.DateTime, new Date())
                    .query('insert into APSUBMENUCLUB (CMENUCLUB, XSUBMENUCLUB, XCOMPONENTE, XCONTENIDO, BACTIVO, CUSUARIOCREACION, FCREACION) values (@cmenuclub, @xsubmenuclub, @xcomponente, @xcontenido, @bactivo, @cusuariocreacion, @fcreacion)')
                rowsAffected = rowsAffected + insert.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    updateSubMenusByClubMenuUpdateQuery: async(submenus, clubMenuData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < submenus.length; i++){
                let update = await pool.request()
                    .input('cmenuclub', sql.Int, clubMenuData.cmenuclub)
                    .input('csubmenuclub', sql.Int, submenus[i].csubmenuclub)
                    .input('xsubmenuclub', sql.NVarChar, submenus[i].xsubmenuclub)
                    .input('xcomponente', sql.NVarChar, submenus[i].xcomponente)
                    .input('xcontenido', sql.NVarChar, submenus[i].xcontenido)
                    .input('bactivo', sql.Bit, submenus[i].bactivo)
                    .input('cusuariomodificacion', sql.Int, clubMenuData.cusuariomodificacion)
                    .input('fmodificacion', sql.DateTime, new Date())
                    .query('update APSUBMENUCLUB set XSUBMENUCLUB = @xsubmenuclub, XCOMPONENTE = @xcomponente, XCONTENIDO = @xcontenido, BACTIVO = @bactivo, CUSUARIOMODIFICACION = @cusuariomodificacion, FMODIFICACION = @fmodificacion where CMENUCLUB = @cmenuclub and CSUBMENUCLUB = @csubmenuclub');
                rowsAffected = rowsAffected + update.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    clubMenuValrepQuery: async() => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .query('select * from VWBUSCARMENUCLUBDATA' );
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    searchClubRoleQuery: async(xrolclub) => {
        try{
            let query = `select * from APROLCLUB where CROLCLUB != ''${ xrolclub ? " and XROLCLUB like '%" + xrolclub + "%'" : '' }`;
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('xrolclub', sql.NVarChar, xrolclub ? xrolclub : null)
                .query(query);
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    verifyClubRoleCodeToCreateQuery: async(clubRoleData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('crolclub', sql.Char(3), clubRoleData.crolclub)
                .query('select * from APROLCLUB where CROLCLUB = @crolclub');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    verifyClubRoleNameToCreateQuery: async(clubRoleData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('xrolclub', sql.NVarChar, clubRoleData.xrolclub)
                .query('select * from APROLCLUB where XROLCLUB = @xrolclub');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    createClubRoleQuery: async(clubRoleData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('crolclub', sql.Char(3), clubRoleData.crolclub)
                .input('xrolclub', sql.NVarChar, clubRoleData.xrolclub)
                .input('bactivo', sql.Bit, clubRoleData.bactivo)
                .input('cusuariocreacion', sql.Int, clubRoleData.cusuariocreacion)
                .input('fcreacion', sql.DateTime, new Date())
                .query('insert into APROLCLUB (CROLCLUB, XROLCLUB, BACTIVO, CUSUARIOCREACION, FCREACION) output inserted.CROLCLUB values (@crolclub, @xrolclub, @bactivo, @cusuariocreacion, @fcreacion)');
                if(result.rowsAffected > 0 && clubRoleData.menus){
                    for(let i = 0; i < clubRoleData.menus.length; i++){
                        let insert = await pool.request()
                            .input('crolclub', sql.Char(3), result.recordset[0].CROLCLUB)
                            .input('cmenuclub', sql.Int, clubRoleData.menus[i].cmenuclub)
                            .input('cusuariocreacion', sql.Int, clubRoleData.cusuariocreacion)
                            .input('fcreacion', sql.DateTime, new Date())
                            .query('insert into APMENUROLCLUB (CROLCLUB, CMENUCLUB, CUSUARIOCREACION, FCREACION) values (@crolclub, @cmenuclub, @cusuariocreacion, @fcreacion)')
                    }
                }
                //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    getClubRoleDataQuery: async(crolclub) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('crolclub', sql.Char(3), crolclub)
                .query('select * from APROLCLUB where CROLCLUB = @crolclub');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    getClubRoleMenusDataQuery: async(crolclub) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('crolclub', sql.Char(3), crolclub)
                .query('select * from VWBUSCARMENUXROLCLUBDATA where CROLCLUB = @crolclub');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    verifyClubRoleNameToUpdateQuery: async(clubRoleData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('crolclub', sql.Char(3), clubRoleData.crolclub)
                .input('xrolclub', sql.NVarChar, clubRoleData.xrolclub)
                .query('select * from APROLCLUB where XROLCLUB = @xrolclub and CROLCLUB != @crolclub');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    updateClubRoleQuery: async(clubRoleData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('crolclub', sql.Char(3), clubRoleData.crolclub)
                .input('xrolclub', sql.NVarChar, clubRoleData.xrolclub)
                .input('bactivo', sql.Bit, clubRoleData.bactivo)
                .input('cusuariomodificacion', sql.Int, clubRoleData.cusuariomodificacion)
                .input('fmodificacion', sql.DateTime, new Date())
                .query('update APROLCLUB set XROLCLUB = @xrolclub, BACTIVO = @bactivo, CUSUARIOMODIFICACION = @cusuariomodificacion, FMODIFICACION = @fmodificacion where CROLCLUB = @crolclub');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    createMenusByClubRoleUpdateQuery: async(menus, clubRoleData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < menus.length; i++){
                let insert = await pool.request()
                    .input('crolclub', sql.Char(3), clubRoleData.crolclub)
                    .input('cmenuclub', sql.Int, menus[i].cmenuclub)
                    .input('cusuariocreacion', sql.Int, clubRoleData.cusuariomodificacion)
                    .input('fcreacion', sql.DateTime, new Date())
                    .query('insert into APMENUROLCLUB (CROLCLUB, CMENUCLUB, CUSUARIOCREACION, FCREACION) values (@crolclub, @cmenuclub, @cusuariocreacion, @fcreacion)')
                rowsAffected = rowsAffected + insert.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    updateMenusByClubRoleUpdateQuery: async(menus, clubRoleData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < menus.length; i++){
                let update = await pool.request()
                    .input('crolclub', sql.Char(3), clubRoleData.crolclub)
                    .input('cmenuclub', sql.Int, menus[i].cmenuclub)
                    .input('cusuariomodificacion', sql.Int, clubRoleData.cusuariomodificacion)
                    .input('fmodificacion', sql.DateTime, new Date())
                    .query('update APMENUROLCLUB set CUSUARIOMODIFICACION = @cusuariomodificacion, FMODIFICACION = @fmodificacion where CMENUCLUB = @cmenuclub and CROLCLUB = @crolclub');
                rowsAffected = rowsAffected + update.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    deleteMenusByClubRoleUpdateQuery: async(menus, clubRoleData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < menus.length; i++){
                let erase = await pool.request()
                    .input('crolclub', sql.Char(3), clubRoleData.crolclub)
                    .input('cmenuclub', sql.Int, menus[i].cmenuclub)
                    .query('delete from APMENUROLCLUB where CMENUCLUB = @cmenuclub and CROLCLUB = @crolclub');
                rowsAffected = rowsAffected + erase.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    searchClubPermissionQuery: async(searchData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('crolclub', sql.Char(3), searchData.crolclub)
                .input('cpais', sql.Numeric(4, 0), searchData.cpais)
                .input('ccompania', sql.Int, searchData.ccompania)
                .query('select * from VWBUSCARMENUXROLCLUBDATA where CROLCLUB = @crolclub and CPAIS = @cpais and CCOMPANIA = @ccompania');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    searchEmailAlertQuery: async(searchData) => {
        try{
            let query = `select * from ALCORREO where CCORREO != 0${ searchData.cpais ? ' and CPAIS = @cpais' : '' }${ searchData.ccompania ? ' and CCOMPANIA = @ccompania' : '' }${ searchData.xcorreo ? " and XCORREO like '%" + searchData.xcorreo + "%'" : '' }`;
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cpais', sql.Numeric(4, 0), searchData.cpais ? searchData.cpais : 1)
                .input('ccompania', sql.Int, searchData.ccompania ? searchData.ccompania : 1)
                .input('xcorreo', sql.NVarChar, searchData.xcorreo ? searchData.xcorreo : null)
                .query(query);
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    verifyEmailAlertNameToCreateQuery: async(emailAlertData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cpais', sql.Numeric(4, 0), emailAlertData.cpais)
                .input('ccompania', sql.Int, emailAlertData.ccompania)
                .input('ilenguaje', sql.Char(2), emailAlertData.ilenguaje)
                .input('xcorreo', sql.NVarChar, emailAlertData.xcorreo)
                .query('select * from ALCORREO where XCORREO = @xcorreo and CPAIS = @cpais and CCOMPANIA = @ccompania and ILENGUAJE = @ilenguaje');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    createEmailAlertQuery: async(emailAlertData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('xcorreo', sql.NVarChar, emailAlertData.xcorreo)
                .input('ilenguaje', sql.Char(2), emailAlertData.ilenguaje)
                .input('xasunto', sql.NVarChar, emailAlertData.xasunto)
                .input('xhtml', sql.NVarChar, emailAlertData.xhtml)
                .input('bactivo', sql.Bit, emailAlertData.bactivo)
                .input('cpais', sql.Numeric(4, 0), emailAlertData.cpais)
                .input('ccompania', sql.Int, emailAlertData.ccompania)
                .input('cusuariocreacion', sql.Int, emailAlertData.cusuariocreacion)
                .input('fcreacion', sql.DateTime, new Date())
                .query('insert into ALCORREO (XCORREO, ILENGUAJE, XASUNTO, XHTML, BACTIVO, CPAIS, CCOMPANIA, CUSUARIOCREACION, FCREACION) output inserted.CCORREO values (@xcorreo, @ilenguaje, @xasunto, @xhtml, @bactivo, @cpais, @ccompania, @cusuariocreacion, @fcreacion)');
            if(result.rowsAffected > 0 && emailAlertData.roles){
                for(let i = 0; i < emailAlertData.roles.length; i++){
                    let insert = await pool.request()
                        .input('ccorreo', sql.Int, result.recordset[0].CCORREO)
                        .input('crol', sql.Int, emailAlertData.roles[i].crol)
                        .input('cdepartamento', sql.Int, emailAlertData.roles[i].cdepartamento)
                        .input('cusuariocreacion', sql.Int, emailAlertData.cusuariocreacion)
                        .input('fcreacion', sql.DateTime, new Date())
                        .query('insert into ALROLCORREO (CCORREO, CROL, CDEPARTAMENTO, CUSUARIOCREACION, FCREACION) values (@ccorreo, @crol, @cdepartamento, @cusuariocreacion, @fcreacion)')
                }
            }
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    getEmailAlertDataQuery: async(ccorreo) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('ccorreo', sql.Int, ccorreo)
                .query('select * from ALCORREO where CCORREO = @ccorreo');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    getEmailAlertRolesDataQuery: async(ccorreo) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('ccorreo', sql.Int, ccorreo)
                .query('select * from VWBUSCARROLXCORREODATA where CCORREO = @ccorreo');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    verifyEmailAlertNameToUpdateQuery: async(emailAlertData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('ccorreo', sql.Int, emailAlertData.ccorreo)
                .input('xcorreo', sql.NVarChar, emailAlertData.xcorreo)
                .input('cpais', sql.Numeric(4, 0), emailAlertData.cpais)
                .input('ccompania', sql.Int, emailAlertData.ccompania)
                .input('ilenguaje', sql.Char(2), emailAlertData.ilenguaje)
                .query('select * from ALCORREO where XCORREO = @xcorreo and CPAIS = @cpais and CCOMPANIA = @ccompania and ILENGUAJE = @ilenguaje and CCORREO != @ccorreo');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    updateEmailAlertQuery: async(emailAlertData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('ccorreo', sql.Int, emailAlertData.ccorreo)
                .input('xcorreo', sql.NVarChar, emailAlertData.xcorreo)
                .input('ilenguaje', sql.Char(2), emailAlertData.ilenguaje)
                .input('xasunto', sql.NVarChar, emailAlertData.xasunto)
                .input('xhtml', sql.NVarChar, emailAlertData.xhtml)
                .input('bactivo', sql.Bit, emailAlertData.bactivo)
                .input('cpais', sql.Numeric(4, 0), emailAlertData.cpais)
                .input('ccompania', sql.Int, emailAlertData.ccompania)
                .input('cusuariomodificacion', sql.Int, emailAlertData.cusuariomodificacion)
                .input('fmodificacion', sql.DateTime, new Date())
                .query('update ALCORREO set XCORREO = @xcorreo, ILENGUAJE = @ilenguaje, XASUNTO = @xasunto, XHTML = @xhtml, BACTIVO = @bactivo, CPAIS = @cpais, CCOMPANIA = @ccompania, CUSUARIOMODIFICACION = @cusuariomodificacion, FMODIFICACION = @fmodificacion where CCORREO = @ccorreo');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    deleteRolesByEmailAlertUpdateQuery: async(roles, emailAlertData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < roles.length; i++){
                let erase = await pool.request()
                    .input('ccorreo', sql.Int, emailAlertData.ccorreo)
                    .input('crol', sql.Int, roles[i].crol)
                    .input('cdepartamento', sql.Int, roles[i].cdepartamento)
                    .query('delete from ALROLCORREO where CCORREO = @ccorreo and CROL = @crol and CDEPARTAMENTO = @cdepartamento');
                rowsAffected = rowsAffected + erase.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    createRolesByEmailAlertUpdateQuery: async(roles, emailAlertData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < roles.length; i++){
                let insert = await pool.request()
                    .input('ccorreo', sql.Int, emailAlertData.ccorreo)
                    .input('crol', sql.Int, roles[i].crol)
                    .input('cdepartamento', sql.Int, roles[i].cdepartamento)
                    .input('cusuariocreacion', sql.Int, emailAlertData.cusuariomodificacion)
                    .input('fcreacion', sql.DateTime, new Date())
                    .query('insert into ALROLCORREO (CCORREO, CROL, CDEPARTAMENTO, CUSUARIOCREACION, FCREACION) values (@ccorreo, @crol, @cdepartamento, @cusuariocreacion, @fcreacion)')
                rowsAffected = rowsAffected + insert.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    updateRolesByEmailAlertUpdateQuery: async(roles, emailAlertData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < roles.length; i++){
                let update = await pool.request()
                    .input('ccorreo', sql.Int, emailAlertData.ccorreo)
                    .input('crol', sql.Int, roles[i].crol)
                    .input('cdepartamento', sql.Int, roles[i].cdepartamento)
                    .input('cusuariomodificacion', sql.Int, emailAlertData.cusuariomodificacion)
                    .input('fmodificacion', sql.DateTime, new Date())
                    .query('update ALROLCORREO set CUSUARIOMODIFICACION = @cusuariomodificacion, FMODIFICACION = @fmodificacion where CCORREO = @ccorreo and CROL = @crol and CDEPARTAMENTO = @cdepartamento');
                rowsAffected = rowsAffected + update.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    getEmailAlertOperationDataQuery: async(operationData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('xcorreo', sql.NVarChar, operationData.xcorreo)
                .input('ilenguaje', sql.Char(2), operationData.ilenguaje)
                .input('cpais', sql.Numeric(4, 0), operationData.cpais)
                .input('ccompania', sql.Int, operationData.ccompania)
                .query('select * from ALCORREO where XCORREO = @xcorreo and ILENGUAJE = @ilenguaje and CPAIS = @cpais and CCOMPANIA = @ccompania');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    getUserEmailsDataQuery: async(ccorreo) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('ccorreo', sql.Int, ccorreo)
                .query('select * from VWBUSCARUSUARIOXROLXCORREODATA where CCORREO = @ccorreo');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    verifyClubEmailQuery: async(xemail) =>{
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('xemail', sql.NVarChar, xemail)
                .input('bactivo', sql.Bit, true)
                .query('select * from SEUSUARIOCLUB where XEMAIL = @xemail and BACTIVO = @bactivo');
            //sql.close();
            return { result: result };
        }
        catch(err){
            return { error: err.message};
        }
    },
    createPasswordChangeTokenQuery: async(ccambiocontrasenaclub, cusuarioclub) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cusuarioclub', sql.Int, cusuarioclub)
                .input('bactivo', sql.Bit, true)
                .query('select * from COCAMBIOCONTRASENACLUB where CUSUARIOCLUB = @cusuarioclub and BACTIVO = @bactivo')
            if(result.rowsAffected > 0){
                for(let i = 0; i < result.recordset.length; i++){
                    await pool.request()
                        .input('ccambiocontrasenaclub', sql.NChar(20), result.recordset[i].CCAMBIOCONTRASENACLUB)
                        .input('bactivo', sql.Bit, false)
                        .query('update COCAMBIOCONTRASENACLUB set BACTIVO = @bactivo where CCAMBIOCONTRASENACLUB = @ccambiocontrasenaclub')
                }
            }
            let create = await pool.request()
                .input('cusuarioclub', sql.Int, cusuarioclub)
                .input('bactivo', sql.Bit, true)
                .input('ccambiocontrasenaclub', sql.NChar(20), ccambiocontrasenaclub)
                .input('fcreacion', sql.DateTime, new Date())
                .query('insert into COCAMBIOCONTRASENACLUB (CCAMBIOCONTRASENACLUB, CUSUARIOCLUB, BACTIVO, FCREACION) values (@ccambiocontrasenaclub, @cusuarioclub, @bactivo, @fcreacion)')
            //sql.close();
            return { result: create };
        }
        catch(err){
            return { error: err.message };
        }
    },
    updatePasswordChangeTokenQuery:  async(clubUserData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('ccambiocontrasenaclub', sql.NChar(20), clubUserData.ccambiocontrasenaclub)
                .input('cusuarioclub', sql.Int, clubUserData.cusuarioclub)
                .input('bactivo', sql.Bit, false)
                .query('update COCAMBIOCONTRASENACLUB set BACTIVO = @bactivo where CCAMBIOCONTRASENACLUB = @ccambiocontrasenaclub and CUSUARIOCLUB = @cusuarioclub');
            //sql.close();
            return { result: result }; 
        }catch(err){
            return { error: err.message };
        }
    },
    updateClubUserPasswordQuery: async(clubUserData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cusuarioclub', sql.Int, clubUserData.cusuarioclub)
                .input('xcontrasena', sql.NVarChar, clubUserData.xcontrasena)
                .input('cusuariomodificacion', sql.Int, clubUserData.cusuarioclub)
                .input('fmodificacion', sql.DateTime, new Date())
                .query('update SEUSUARIOCLUB set XCONTRASENA = @xcontrasena, FMODIFICACION = @fmodificacion, CUSUARIOMODIFICACION = @cusuariomodificacion where CUSUARIOCLUB = @cusuarioclub');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    searchProviderQuery: async(searchData) => {
        try{
            let query = `select * from PRPROVEEDORES where CCOMPANIA = @ccompania and BACTIVO = 1${ searchData.xnombre ? " and XNOMBRE like '%" + searchData.xnombre + "%'" : '' }${ searchData.xdocidentidad ? " and XDOCIDENTIDAD like '%" + searchData.xdocidentidad + "%'" : '' }`;
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('ccompania', sql.Numeric(4, 0), searchData.ccompania)
                .input('xnombre', sql.NVarChar, searchData.xnombre ? searchData.xnombre: undefined)
                .input('xdocidentidad', sql.NVarChar, searchData.xdocidentidad ? searchData.xdocidentidad : undefined)
                .query(query);
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    verifyProviderIdentificationToCreateQuery: async(providerData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cpais', sql.Numeric(4, 0), providerData.cpais)
                .input('ccompania', sql.Int, providerData.ccompania)
                .input('ctipodocidentidad', sql.Int, providerData.ctipodocidentidad)
                .input('xdocidentidad', sql.NVarChar, providerData.xdocidentidad)
                .query('select * from PRPROVEEDOR where XDOCIDENTIDAD = @xdocidentidad and CTIPODOCIDENTIDAD = @ctipodocidentidad and CPAIS = @cpais and CCOMPANIA = @ccompania');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    createProviderQuery: async(providerData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cpais', sql.Numeric(4, 0), providerData.cpais)
                .input('ccompania', sql.Int, providerData.ccompania)
                .input('xdocidentidad', sql.NVarChar, providerData.xdocidentidad)
                .input('cestado', sql.Int, providerData.cestado)
                .input('cciudad', sql.Int, providerData.cciudad)
                .input('xnombre', sql.NVarChar, providerData.xnombre)
                .input('xdireccion', sql.NVarChar, providerData.xdireccion)
                .input('xcorreo', sql.NVarChar, providerData.xcorreo ? providerData.xcorreo : null)
                .input('xtelefonocelular', sql.NVarChar, providerData.xtelefonocelular)
                .input('xtelefono', sql.NVarChar, providerData.xtelefono)
                .input('xrazonsocial', sql.NVarChar, providerData.xrazonsocial)
                .input('centeimpuesto', sql.NVarChar, providerData.centeimpuesto)
                .input('nlimite', sql.Int, providerData.nlimite)
                .input('pretencion', sql.Numeric(5, 2), providerData.pretencion ? providerData.pretencion : null)
                .input('pislr', sql.Numeric(5, 2), providerData.pislr ? providerData.pislr : null)
                .input('xobservacion', sql.NVarChar, providerData.xobservacion)
                .input('bactivo', sql.Bit, providerData.bactivo)
                .input('cusuariocreacion', sql.Int, providerData.cusuariocreacion)
                .input('fcreacion', sql.DateTime, new Date())
                .query('insert into PRPROVEEDORES (CPAIS, CCOMPANIA, XDOCIDENTIDAD, CESTADO, CCIUDAD, XNOMBRE, XRAZONSOCIAL, XTELEFONO, CENTEIMPUESTO, NLIMITE, XCORREO, PRETENCION, PISLR, XDIRECCION, XOBSERVACION, BACTIVO, CUSUARIOCREACION, FCREACION) output inserted.CPROVEEDOR values (@cpais, @ccompania, @xdocidentidad, @cestado, @cciudad, @xnombre, @xrazonsocial, @xtelefono, @centeimpuesto, @nlimite, @xcorreo, @pretencion, @pislr, @xdireccion, @xobservacion, @bactivo, @cusuariocreacion, @fcreacion)');
            if(result.rowsAffected > 0 && providerData.banks){
                for(let i = 0; i < providerData.banks.length; i++){
                    let insert = await pool.request()
                        .input('cproveedor', sql.Int, result.recordset[0].CPROVEEDOR)
                        .input('cbanco', sql.Int, providerData.banks[i].cbanco)
                        .input('ctipocuentabancaria', sql.Int, providerData.banks[i].ctipocuentabancaria)
                        .input('xnumerocuenta', sql.NVarChar, providerData.banks[i].xnumerocuenta)
                        .input('bprincipal', sql.Bit, providerData.banks[i].bprincipal)
                        .input('cusuariocreacion', sql.Int, providerData.cusuariocreacion)
                        .input('fcreacion', sql.DateTime, new Date())
                        .query('insert into PRBANCO (CPROVEEDOR, CBANCO, CTIPOCUENTABANCARIA, XNUMEROCUENTA, BPRINCIPAL, CUSUARIOCREACION, FCREACION) values (@cproveedor, @cbanco, @ctipocuentabancaria, @xnumerocuenta, @bprincipal, @cusuariocreacion, @fcreacion)')
                }
            }
            if(result.rowsAffected > 0 && providerData.contacts){
                for(let i = 0; i < providerData.contacts.length; i++){
                    let insert = await pool.request()
                        .input('cproveedor', sql.Int, result.recordset[0].CPROVEEDOR)
                        .input('xnombre', sql.NVarChar, providerData.contacts[i].xnombre)
                        .input('xapellido', sql.NVarChar, providerData.contacts[i].xapellido)
                        .input('ctipodocidentidad', sql.Int,  providerData.contacts[i].ctipodocidentidad)
                        .input('xdocidentidad', sql.NVarChar, providerData.contacts[i].xdocidentidad)
                        .input('xtelefonocelular', sql.NVarChar, providerData.contacts[i].xtelefonocelular)
                        .input('xemail', sql.NVarChar, providerData.contacts[i].xemail)
                        .input('xcargo', sql.NVarChar, providerData.contacts[i].xcargo ? providerData.contacts[i].xcargo : null)
                        .input('xtelefonooficina', sql.NVarChar, providerData.contacts[i].xtelefonooficina ? providerData.contacts[i].xtelefonooficina : null)
                        .input('xtelefonocasa', sql.NVarChar, providerData.contacts[i].xtelefonocasa ? providerData.contacts[i].xtelefonocasa : null)
                        .input('xfax', sql.NVarChar, providerData.contacts[i].xfax ? providerData.contacts[i].xfax : null)
                        .input('cusuariocreacion', sql.Int, providerData.cusuariocreacion)
                        .input('fcreacion', sql.DateTime, new Date())
                        .query('insert into PRCONTACTO (CPROVEEDOR, XNOMBRE, XAPELLIDO, CTIPODOCIDENTIDAD, XDOCIDENTIDAD, XTELEFONOCELULAR, XEMAIL, XCARGO, XTELEFONOOFICINA, XTELEFONOCASA, XFAX, CUSUARIOCREACION, FCREACION) values (@cproveedor, @xnombre, @xapellido, @ctipodocidentidad, @xdocidentidad, @xtelefonocelular, @xemail, @xcargo, @xtelefonooficina, @xtelefonocasa, @xfax, @cusuariocreacion, @fcreacion)')
                }
            }
            if(result.rowsAffected > 0 && providerData.states){
                for(let i = 0; i < providerData.states.length; i++){
                    let insert = await pool.request()
                        .input('cproveedor', sql.Int, result.recordset[0].CPROVEEDOR)
                        .input('cestado', sql.Int, providerData.states[i].cestado)
                        .input('cusuariocreacion', sql.Int, providerData.cusuariocreacion)
                        .input('fcreacion', sql.DateTime, new Date())
                        .query('insert into PRESTADO (CPROVEEDOR, CESTADO, CUSUARIOCREACION, FCREACION) values (@cproveedor, @cestado, @cusuariocreacion, @fcreacion)')
                }
            }
            if(result.rowsAffected > 0 && providerData.brands){
                for(let i = 0; i < providerData.brands.length; i++){
                    let insert = await pool.request()
                        .input('cproveedor', sql.Int, result.recordset[0].CPROVEEDOR)
                        .input('cmarca', sql.Int, providerData.brands[i].cmarca)
                        .input('cusuariocreacion', sql.Int, providerData.cusuariocreacion)
                        .input('fcreacion', sql.DateTime, new Date())
                        .query('insert into PRMARCA (CPROVEEDOR, CMARCA, CUSUARIOCREACION, FCREACION) values (@cproveedor, @cmarca, @cusuariocreacion, @fcreacion)')
                }
            }
            if(result.rowsAffected > 0 && providerData.services){
                for(let i = 0; i < providerData.services.length; i++){
                    let insert = await pool.request()
                        .input('cproveedor', sql.Int, result.recordset[0].CPROVEEDOR)
                        .input('cservicio', sql.Int, providerData.services[i].cservicio)
                        .input('cestado', sql.Int, providerData.services[i].cestado)
                        .query('insert into PRPROVEEDOR_SERVICIO (CPROVEEDOR, CSERVICIO, CESTADO) values (@cproveedor, @cservicio, @cestado)')
                }
            }
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    verifyProviderIdentificationToUpdateQuery: async(providerData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cpais', sql.Numeric(4, 0), providerData.cpais)
                .input('ccompania', sql.Int, providerData.ccompania)
                .input('cproveedor', sql.NVarChar, providerData.cproveedor)
                .input('ctipodocidentidad', sql.Int, providerData.ctipodocidentidad)
                .input('xdocidentidad', sql.NVarChar, providerData.xdocidentidad)
                .query('select * from PRPROVEEDOR where XDOCIDENTIDAD = @xdocidentidad and CTIPODOCIDENTIDAD = @ctipodocidentidad and CPAIS = @cpais and CCOMPANIA = @ccompania and CPROVEEDOR != @cproveedor');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    updateProviderQuery: async(providerData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('ccompania', sql.Int, providerData.ccompania)
                .input('cpais', sql.Int, providerData.cpais)
                .input('cproveedor', sql.Int, providerData.cproveedor)
                .input('xnombre', sql.NVarChar, providerData.xnombre)
                .input('xdocidentidad', sql.NVarChar, providerData.xdocidentidad)
                .input('cestado', sql.Int, providerData.cestado)
                .input('cciudad', sql.Int, providerData.cciudad)
                .input('xdireccion', sql.NVarChar, providerData.xdireccion)
                .input('xtelefono', sql.NVarChar, providerData.xtelefono)
                .input('xcorreo', sql.NVarChar, providerData.xcorreo ? providerData.xcorreo : null)
                .input('pretencion', sql.Numeric(5, 2), providerData.pretencion)
                .input('pislr', sql.Numeric(5, 2), providerData.pislr)
                .input('centeimpuesto', sql.NVarChar, providerData.centeimpuesto)
                .input('nlimite', sql.Int, providerData.nlimite)
                .input('xobservacion', sql.NVarChar, providerData.xobservacion)
                .input('bactivo', sql.Bit, 1)
                .input('cusuariomodificacion', sql.Int, providerData.cusuariomodificacion)
                .input('fmodificacion', sql.DateTime, new Date())
                .query('update PRPROVEEDORES set XNOMBRE = @xnombre, XDOCIDENTIDAD = @xdocidentidad, CESTADO = @cestado, CCIUDAD = @cciudad, XDIRECCION = @xdireccion, XTELEFONO = @xtelefono, XCORREO = @xcorreo, PRETENCION = @pretencion, CENTEIMPUESTO = @centeimpuesto, NLIMITE = @nlimite, PISLR = @pislr, XOBSERVACION = @xobservacion, BACTIVO = @bactivo, CUSUARIOMODIFICACION = @cusuariomodificacion, FMODIFICACION = @fmodificacion where CPROVEEDOR = @cproveedor and CPAIS = @cpais and CCOMPANIA = @ccompania');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    createBanksByProviderUpdateQuery: async(bankList, providerData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < bankList.length; i++){
                let insert = await pool.request()
                    .input('cproveedor', sql.Int, providerData.cproveedor)
                    .input('cbanco', sql.Int, bankList[i].cbanco)
                    .input('ctipocuentabancaria', sql.Int, bankList[i].ctipocuentabancaria)
                    .input('xnumerocuenta', sql.NVarChar, bankList[i].xnumerocuenta)
                    .input('bprincipal', sql.Bit, bankList[i].bprincipal)
                    .input('cusuariocreacion', sql.Int, providerData.cusuariomodificacion)
                    .input('fcreacion', sql.DateTime, new Date())
                    .query('insert into PRBANCO (CPROVEEDOR, CBANCO, CTIPOCUENTABANCARIA, XNUMEROCUENTA, BPRINCIPAL, CUSUARIOCREACION, FCREACION) values (@cproveedor, @cbanco, @ctipocuentabancaria, @xnumerocuenta, @bprincipal, @cusuariocreacion, @fcreacion)')
                rowsAffected = rowsAffected + insert.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    updateBanksByProviderUpdateQuery: async(banks, providerData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < banks.length; i++){
                let update = await pool.request()
                    .input('cproveedor', sql.Int, providerData.cproveedor)
                    .input('cbanco', sql.Int, banks[i].cbanco)
                    .input('ctipocuentabancaria', sql.Int, banks[i].ctipocuentabancaria)
                    .input('xnumerocuenta', sql.NVarChar, banks[i].xnumerocuenta)
                    .input('bprincipal', sql.Bit, banks[i].bprincipal)
                    .input('cusuariomodificacion', sql.Int, providerData.cusuariomodificacion)
                    .input('fmodificacion', sql.DateTime, new Date())
                    .query('update PRBANCO set CTIPOCUENTABANCARIA = @ctipocuentabancaria, XNUMEROCUENTA = @xnumerocuenta, BPRINCIPAL = @bprincipal, CUSUARIOMODIFICACION = @cusuariomodificacion, FMODIFICACION = @fmodificacion where CBANCO = @cbanco and CPROVEEDOR = @cproveedor');
                rowsAffected = rowsAffected + update.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    deleteBanksByProviderUpdateQuery: async(banks, providerData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < banks.length; i++){
                let erase = await pool.request()
                    .input('cproveedor', sql.Int, providerData.cproveedor)
                    .input('cbanco', sql.Int, banks[i].cbanco)
                    .query('delete from PRBANCO where CBANCO = @cbanco and CPROVEEDOR = @cproveedor');
                rowsAffected = rowsAffected + erase.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    createStatesByProviderUpdateQuery: async(states, providerData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < states.length; i++){
                let insert = await pool.request()
                    .input('cproveedor', sql.Int, providerData.cproveedor)
                    .input('cestado', sql.Int, states[i].cestado)
                    .input('cusuariocreacion', sql.Int, providerData.cusuariomodificacion)
                    .input('fcreacion', sql.DateTime, new Date())
                    .query('insert into PRESTADO (CPROVEEDOR, CESTADO, CUSUARIOCREACION, FCREACION) values (@cproveedor, @cestado, @cusuariocreacion, @fcreacion)')
                rowsAffected = rowsAffected + insert.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    updateStatesByProviderUpdateQuery: async(states, providerData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < states.length; i++){
                let update = await pool.request()
                    .input('cproveedor', sql.Int, providerData.cproveedor)
                    .input('cestado', sql.Int, states[i].cestado)
                    .input('cusuariomodificacion', sql.Int, providerData.cusuariomodificacion)
                    .input('fmodificacion', sql.DateTime, new Date())
                    .query('update PRESTADO set CUSUARIOMODIFICACION = @cusuariomodificacion, FMODIFICACION = @fmodificacion where CESTADO = @cestado and CPROVEEDOR = @cproveedor');
                rowsAffected = rowsAffected + update.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    deleteStatesByProviderUpdateQuery: async(states, providerData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < states.length; i++){
                let erase = await pool.request()
                    .input('cproveedor', sql.Int, providerData.cproveedor)
                    .input('cestado', sql.Int, states[i].cestado)
                    .query('delete from PRESTADO where CESTADO = @cestado and CPROVEEDOR = @cproveedor');
                rowsAffected = rowsAffected + erase.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    createBrandsByProviderUpdateQuery: async(brands, providerData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < brands.length; i++){
                let insert = await pool.request()
                    .input('cproveedor', sql.Int, providerData.cproveedor)
                    .input('cmarca', sql.Int, brands[i].cmarca)
                    .input('cusuariocreacion', sql.Int, providerData.cusuariomodificacion)
                    .input('fcreacion', sql.DateTime, new Date())
                    .query('insert into PRMARCA (CPROVEEDOR, CMARCA, CUSUARIOCREACION, FCREACION) values (@cproveedor, @cmarca, @cusuariocreacion, @fcreacion)')
                rowsAffected = rowsAffected + insert.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    updateBrandsByProviderUpdateQuery: async(brands, providerData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < brands.length; i++){
                let update = await pool.request()
                    .input('cproveedor', sql.Int, providerData.cproveedor)
                    .input('cmarca', sql.Int, brands[i].cmarca)
                    .input('cusuariomodificacion', sql.Int, providerData.cusuariomodificacion)
                    .input('fmodificacion', sql.DateTime, new Date())
                    .query('update PRMARCA set CUSUARIOMODIFICACION = @cusuariomodificacion, FMODIFICACION = @fmodificacion where CMARCA = @cmarca and CPROVEEDOR = @cproveedor');
                rowsAffected = rowsAffected + update.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    deleteBrandsByProviderUpdateQuery: async(brands, providerData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < brands.length; i++){
                let erase = await pool.request()
                    .input('cproveedor', sql.Int, providerData.cproveedor)
                    .input('cmarca', sql.Int, brands[i].cmarca)
                    .query('delete from PRMARCA where CMARCA = @cmarca and CPROVEEDOR = @cproveedor');
                rowsAffected = rowsAffected + erase.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    createServicesByProviderUpdateQuery: async(services, providerData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < services.length; i++){
                let insert = await pool.request()
                    .input('cproveedor', sql.Int, providerData.cproveedor)
                    .input('cservicio', sql.Int, services[i].cservicio)
                    .input('cestado', sql.Int, services[i].cestado)
                    .query('insert into PRPROVEEDOR_SERVICIO (CPROVEEDOR, CSERVICIO, CESTADO) values (@cproveedor, @cservicio, @cestado)')
                rowsAffected = rowsAffected + insert.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    updateServicesByProviderUpdateQuery: async(services, providerData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < services.length; i++){
                let update = await pool.request()
                    .input('cproveedor', sql.Int, providerData.cproveedor)
                    .input('cservicio', sql.Int, services[i].cservicio)
                    .input('cestado', sql.Int, services[i].cestado)
                    .query('update PRPROVEEDOR_SERVICIO set CSERVICIO = @cservicio, CESTADO = @cestado where CPROVEEDOR = @cproveedor');
                rowsAffected = rowsAffected + update.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    deleteServicesByProviderUpdateQuery: async(services, providerData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < services.length; i++){
                let erase = await pool.request()
                    .input('cproveedor', sql.Int, providerData.cproveedor)
                    .input('cservicio', sql.Int, services[i].cservicio)
                    .query('delete from PRSERVICIO where CSERVICIO = @cservicio and CPROVEEDOR = @cproveedor');
                rowsAffected = rowsAffected + erase.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    createContactsByProviderUpdateQuery: async(contacts, providerData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < contacts.length; i++){
                let insert = await pool.request()
                    .input('cproveedor', sql.Int, providerData.cproveedor)
                    .input('xnombre', sql.NVarChar, contacts[i].xnombre)
                    .input('xapellido', sql.NVarChar, contacts[i].xapellido)
                    .input('ctipodocidentidad', sql.Int, contacts[i].ctipodocidentidad)
                    .input('xdocidentidad', sql.NVarChar, contacts[i].xdocidentidad)
                    .input('xtelefonocelular', sql.NVarChar, contacts[i].xtelefonocelular)
                    .input('xemail', sql.NVarChar, contacts[i].xemail)
                    .input('xcargo', sql.NVarChar, contacts[i].xcargo ? contacts[i].xcargo : null)
                    .input('xfax', sql.NVarChar, contacts[i].xfax ? contacts[i].xfax : null)
                    .input('xtelefonooficina', sql.NVarChar, contacts[i].xtelefonooficina ? contacts[i].xtelefonooficina : null)
                    .input('xtelefonocasa', sql.NVarChar, contacts[i].xtelefonocasa ? contacts[i].xtelefonocasa : null)
                    .input('cusuariocreacion', sql.Int, providerData.cusuariomodificacion)
                    .input('fcreacion', sql.DateTime, new Date())
                    .query('insert into PRCONTACTO (CPROVEEDOR, XNOMBRE, XAPELLIDO, CTIPODOCIDENTIDAD, XDOCIDENTIDAD, XTELEFONOCELULAR, XEMAIL, XCARGO, XFAX, XTELEFONOOFICINA, XTELEFONOCASA, CUSUARIOCREACION, FCREACION) values (@cproveedor, @xnombre, @xapellido, @ctipodocidentidad, @xdocidentidad, @xtelefonocelular, @xemail, @xcargo, @xfax, @xtelefonooficina, @xtelefonocasa, @cusuariocreacion, @fcreacion)')
                rowsAffected = rowsAffected + insert.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    updateContactsByProviderUpdateQuery: async(contacts, providerData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < contacts.length; i++){
                let update = await pool.request()
                    .input('cproveedor', sql.Int, providerData.cproveedor)
                    .input('ccontacto', sql.Int, contacts[i].ccontacto)
                    .input('xnombre', sql.NVarChar, contacts[i].xnombre)
                    .input('xapellido', sql.NVarChar, contacts[i].xapellido)
                    .input('ctipodocidentidad', sql.Int, contacts[i].ctipodocidentidad)
                    .input('xdocidentidad', sql.NVarChar, contacts[i].xdocidentidad)
                    .input('xtelefonocelular', sql.NVarChar, contacts[i].xtelefonocelular)
                    .input('xemail', sql.NVarChar, contacts[i].xemail)
                    .input('xcargo', sql.NVarChar, contacts[i].xcargo ? contacts[i].xcargo : null)
                    .input('xfax', sql.NVarChar, contacts[i].xfax ? contacts[i].xfax : null)
                    .input('xtelefonooficina', sql.NVarChar, contacts[i].xtelefonooficina ? contacts[i].xtelefonooficina : null)
                    .input('xtelefonocasa', sql.NVarChar, contacts[i].xtelefonocasa ? contacts[i].xtelefonocasa : null)
                    .input('cusuariomodificacion', sql.Int, providerData.cusuariomodificacion)
                    .input('fmodificacion', sql.DateTime, new Date())
                    .query('update PRCONTACTO set XNOMBRE = @xnombre, XAPELLIDO = @xapellido, CTIPODOCIDENTIDAD = @ctipodocidentidad, XDOCIDENTIDAD = @xdocidentidad, XTELEFONOCELULAR = @xtelefonocelular, XEMAIL = @xemail, XCARGO = @xcargo, XFAX = @xfax, XTELEFONOOFICINA = @xtelefonooficina, XTELEFONOCASA = @xtelefonocasa, CUSUARIOMODIFICACION = @cusuariomodificacion, FMODIFICACION = @fmodificacion where CCONTACTO = @ccontacto and CPROVEEDOR = @cproveedor');
                rowsAffected = rowsAffected + update.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    deleteContactsByProviderUpdateQuery: async(contacts, providerData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < contacts.length; i++){
                let erase = await pool.request()
                    .input('cproveedor', sql.Int, providerData.cproveedor)
                    .input('ccontacto', sql.Int, contacts[i].ccontacto)
                    .query('delete from PRCONTACTO where CCONTACTO = @ccontacto and CPROVEEDOR = @cproveedor');
                rowsAffected = rowsAffected + erase.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    searchFleetNotificationTracingQuery: async(searchData) => {
        try{
            let query = `select * from VWBUSCARSEGUIMIENTONOTIFICACIONFLOTAXUSUARIO where CCOMPANIA = @ccompania and BCERRADO = @bcerrado${ !searchData.btodos ? " and CUSUARIO = @cusuario" : '' }`;
            let pool = await sql.connect(config);
            let result = await pool.request()
                //.input('cpais', sql.Numeric(4, 0), searchData.cpais)
                .input('ccompania', sql.Int, searchData.ccompania)
                .input('bcerrado', sql.Bit, false)
                .input('cusuario', sql.Int, searchData.cusuario)
                .query(query);
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    searchFleetNotificationThirdpartyTracingQuery: async(searchData) => {
        try{
            let query = `select * from VWBUSCARSEGUIMIENTONOTIFICACIONTFLOTATERCEROXUSUARIO where CCOMPANIA = @ccompania and BCERRADO = @bcerrado${ !searchData.btodos ? " and CUSUARIO = @cusuario" : '' }`;
            let pool = await sql.connect(config);
            let result = await pool.request()
                //.input('cpais', sql.Numeric(4, 0), searchData.cpais)
                .input('ccompania', sql.Int, searchData.ccompania = 5)
                .input('bcerrado', sql.Bit, false)
                .input('cusuario', sql.Int, !searchData.btodos ? searchData.cusuario : 1)
                .query(query);
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    searchClubServiceRequestTracingQuery: async(searchData) => {
        try{
            let query = `select * from VWBUSCARSEGUIMIENTOSOLICITUDSERVICIOCLUBXUSUARIO where CCOMPANIA = @ccompania and BCERRADO = @bcerrado${ !searchData.btodos ? " and CUSUARIO = @cusuario" : '' }`;
            let pool = await sql.connect(config);
            let result = await pool.request()
                //.input('cpais', sql.Numeric(4, 0), searchData.cpais)
                .input('ccompania', sql.Int, searchData.ccompania = 5)
                .input('bcerrado', sql.Bit, false)
                .input('cusuario', sql.Int, !searchData.btodos ? searchData.cusuario : 1)
                .query(query);
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    searchVehicleTypeQuery: async(searchData) => {
        try{
            let query = `select * from MATIPOVEHICULO where CPAIS = @cpais${ searchData.xtipovehiculo ? " and XTIPOVEHICULO like '%" + searchData.xtipovehiculo + "%'" : '' }`;
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cpais', sql.Numeric(4, 0), searchData.cpais)
                .query(query);
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    verifyVehicleTypeNameToCreateQuery: async(vehicleTypeData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('xtipovehiculo', sql.NVarChar, vehicleTypeData.xtipovehiculo)
                .input('cpais', sql.Numeric(4, 0), vehicleTypeData.cpais)
                .query('select * from MATIPOVEHICULO where XTIPOVEHICULO = @xtipovehiculo and CPAIS = @cpais');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    createVehicleTypeQuery: async(vehicleTypeData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('xtipovehiculo', sql.NVarChar, vehicleTypeData.xtipovehiculo)
                .input('bactivo', sql.Bit, vehicleTypeData.bactivo)
                .input('cpais', sql.Numeric(4, 0), vehicleTypeData.cpais)
                .input('cusuariocreacion', sql.Int, vehicleTypeData.cusuariocreacion)
                .input('fcreacion', sql.DateTime, new Date())
                .query('insert into MATIPOVEHICULO (XTIPOVEHICULO, BACTIVO, CPAIS, CUSUARIOCREACION, FCREACION) output inserted.CTIPOVEHICULO values (@xtipovehiculo, @bactivo, @cpais, @cusuariocreacion, @fcreacion)');
                //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    getVehicleTypeDataQuery: async(vehicleTypeData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('ctipovehiculo', sql.Int, vehicleTypeData.ctipovehiculo)
                .input('cpais', sql.Numeric(4, 0), vehicleTypeData.cpais)
                .query('select * from MATIPOVEHICULO where CPAIS = @cpais and CTIPOVEHICULO = @ctipovehiculo');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    verifyVehicleTypeNameToUpdateQuery: async(vehicleTypeData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('xtipovehiculo', sql.NVarChar, vehicleTypeData.xtipovehiculo)
                .input('ctipovehiculo', sql.Int, vehicleTypeData.ctipovehiculo)
                .input('cpais', sql.Numeric(4, 0), vehicleTypeData.cpais)
                .query('select * from MATIPOVEHICULO where XTIPOVEHICULO = @xtipovehiculo and CTIPOVEHICULO != @ctipovehiculo and CPAIS = @cpais');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    updateVehicleTypeQuery: async(vehicleTypeData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('ctipovehiculo', sql.Int, vehicleTypeData.ctipovehiculo)
                .input('xtipovehiculo', sql.NVarChar, vehicleTypeData.xtipovehiculo)
                .input('bactivo', sql.Bit, vehicleTypeData.bactivo)
                .input('cpais', sql.Numeric(4, 0), vehicleTypeData.cpais)
                .input('cusuariomodificacion', sql.Int, vehicleTypeData.cusuariomodificacion)
                .input('fmodificacion', sql.DateTime, new Date())
                .query('update MATIPOVEHICULO set XTIPOVEHICULO = @xtipovehiculo, BACTIVO = @bactivo, CUSUARIOMODIFICACION = @cusuariomodificacion, FMODIFICACION = @fmodificacion where CTIPOVEHICULO = @ctipovehiculo and CPAIS = @cpais');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    searchClientQuery: async(searchData) => {
        try{
            let query = `select * from CLCLIENTE where CPAIS = @cpais and CCOMPANIA = @ccompania${ searchData.xcliente ? " and XCLIENTE like '%" + searchData.xcliente + "%'" : '' }${ searchData.ctipodocidentidad ? " and CTIPODOCIDENTIDAD = @ctipodocidentidad" : '' }${ searchData.xdocidentidad ? " and XDOCIDENTIDAD like '%" + searchData.xdocidentidad + "%'" : '' }${ searchData.xcontrato ? " and XCONTRATO like '%" + searchData.xcontrato + "%'" : '' }`;
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cpais', sql.Numeric(4, 0), searchData.cpais ? searchData.cpais : 1)
                .input('ccompania', sql.Int, searchData.ccompania ? searchData.ccompania : 1)
                .input('ctipodocidentidad', sql.Int, searchData.ctipodocidentidad ? searchData.ctipodocidentidad : 1)
                .input('xdocidentidad', sql.NVarChar, searchData.xdocidentidad ? searchData.xdocidentidad : 1)
                .input('xcliente', sql.NVarChar, searchData.xcliente ? searchData.xcliente : 1)
                .input('xcontrato', sql.NVarChar, searchData.xcontrato ? searchData.xcontrato : 1)
                .query(query);
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    verifyClientIdentificationToCreateQuery: async(clientData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cpais', sql.Numeric(4, 0), clientData.cpais)
                .input('ccompania', sql.Int, clientData.ccompania)
                .input('ctipodocidentidad', sql.Int, clientData.ctipodocidentidad)
                .input('xdocidentidad', sql.NVarChar, clientData.xdocidentidad)
                .query('select * from CLCLIENTE where XDOCIDENTIDAD = @xdocidentidad and CTIPODOCIDENTIDAD = @ctipodocidentidad and CPAIS = @cpais and CCOMPANIA = @ccompania');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    createClientQuery: async(clientData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cpais', sql.Numeric(4, 0), clientData.cpais)
                .input('ccompania', sql.Int, clientData.ccompania)
                .input('xcliente', sql.NVarChar, clientData.xcliente)
                .input('xcontrato', sql.NVarChar, clientData.xcontrato)
                .input('xrepresentante', sql.NVarChar, clientData.xrepresentante)
                .input('cempresa', sql.Int, clientData.cempresa)
                .input('cactividadempresa', sql.Int, clientData.cactividadempresa)
                .input('ctipodocidentidad', sql.Int, clientData.ctipodocidentidad)
                .input('xdocidentidad', sql.NVarChar, clientData.xdocidentidad)
                .input('cestado', sql.Int, clientData.cestado)
                .input('cciudad', sql.Int, clientData.cciudad)
                .input('xdireccionfiscal', sql.NVarChar, clientData.xdireccionfiscal)
                .input('xemail', sql.NVarChar, clientData.xemail)
                .input('fanomaximo', sql.Int, clientData.fanomaximo)
                .input('finicio', sql.DateTime, clientData.finicio)
                .input('xtelefono', sql.NVarChar, clientData.xtelefono ? clientData.xtelefono : null)
                .input('bcolectivo', sql.Bit, clientData.bcolectivo)
                .input('bfacturar', sql.Bit, clientData.bfacturar)
                .input('bfinanciar', sql.Bit, clientData.bfinanciar)
                .input('bcontribuyente', sql.Bit, clientData.bcontribuyente)
                .input('bimpuesto', sql.Bit, clientData.bimpuesto)
                .input('bnotificacionsms', sql.Bit, clientData.bnotificacionsms)
                .input('xpaginaweb', sql.NVarChar, clientData.xpaginaweb ? clientData.xpaginaweb : null)
                .input('ctipopago', sql.Int, clientData.ctipopago)
                .input('xrutaimagen', sql.NVarChar, clientData.xrutaimagen ? clientData.xrutaimagen : null)
                .input('ifacturacion', sql.NChar, clientData.ifacturacion)
                .input('bactivo', sql.Bit, clientData.bactivo)
                .input('cusuariocreacion', sql.Int, clientData.cusuariocreacion)
                .input('fcreacion', sql.DateTime, new Date())
                .query('insert into CLCLIENTE (CPAIS, CCOMPANIA, XCLIENTE, XCONTRATO, XREPRESENTANTE, CEMPRESA, CACTIVIDADEMPRESA, CTIPODOCIDENTIDAD, XDOCIDENTIDAD, CESTADO, CCIUDAD, XDIRECCIONFISCAL, XEMAIL, FANOMAXIMO, FINICIO, XTELEFONO, BCOLECTIVO, BFACTURAR, BFINANCIAR, BCONTRIBUYENTE, BIMPUESTO, BNOTIFICACIONSMS, XPAGINAWEB, CTIPOPAGO, XRUTAIMAGEN, IFACTURACION, BACTIVO, CUSUARIOCREACION, FCREACION) output inserted.CCLIENTE values (@cpais, @ccompania, @xcliente, @xcontrato, @xrepresentante, @cempresa, @cactividadempresa, @ctipodocidentidad, @xdocidentidad, @cestado, @cciudad, @xdireccionfiscal, @xemail, @fanomaximo, @finicio, @xtelefono, @bcolectivo, @bfacturar, @bfinanciar, @bcontribuyente, @bimpuesto, @bnotificacionsms, @xpaginaweb, @ctipopago, @xrutaimagen, @ifacturacion, @bactivo, @cusuariocreacion, @fcreacion)');
            if(result.rowsAffected > 0 && clientData.banks){
                for(let i = 0; i < clientData.banks.length; i++){
                    let insert = await pool.request()
                        .input('ccliente', sql.Int, result.recordset[0].CCLIENTE)
                        .input('cbanco', sql.Int, clientData.banks[i].cbanco)
                        .input('ctipocuentabancaria', sql.Int, clientData.banks[i].ctipocuentabancaria)
                        .input('xnumerocuenta', sql.NVarChar, clientData.banks[i].xnumerocuenta)
                        .input('xcontrato', sql.NVarChar, clientData.banks[i].xcontrato)
                        .input('bprincipal', sql.Bit, clientData.banks[i].bprincipal)
                        .input('cusuariocreacion', sql.Int, clientData.cusuariocreacion)
                        .input('fcreacion', sql.DateTime, new Date())
                        .query('insert into CLBANCO (CCLIENTE, CBANCO, CTIPOCUENTABANCARIA, XNUMEROCUENTA, XCONTRATO, BPRINCIPAL, CUSUARIOCREACION, FCREACION) values (@ccliente, @cbanco, @ctipocuentabancaria, @xnumerocuenta, @xcontrato, @bprincipal, @cusuariocreacion, @fcreacion)')
                }
            }
            if(result.rowsAffected > 0 && clientData.contacts){
                for(let i = 0; i < clientData.contacts.length; i++){
                    let insert = await pool.request()
                        .input('ccliente', sql.Int, result.recordset[0].CCLIENTE)
                        .input('xnombre', sql.NVarChar, clientData.contacts[i].xnombre)
                        .input('xapellido', sql.NVarChar, clientData.contacts[i].xapellido)
                        .input('ctipodocidentidad', sql.Int,  clientData.contacts[i].ctipodocidentidad)
                        .input('xdocidentidad', sql.NVarChar, clientData.contacts[i].xdocidentidad)
                        .input('xtelefonocelular', sql.NVarChar, clientData.contacts[i].xtelefonocelular)
                        .input('xemail', sql.NVarChar, clientData.contacts[i].xemail)
                        .input('xcargo', sql.NVarChar, clientData.contacts[i].xcargo ? clientData.contacts[i].xcargo : null)
                        .input('xtelefonooficina', sql.NVarChar, clientData.contacts[i].xtelefonooficina ? clientData.contacts[i].xtelefonooficina : null)
                        .input('xtelefonocasa', sql.NVarChar, clientData.contacts[i].xtelefonocasa ? clientData.contacts[i].xtelefonocasa : null)
                        .input('xfax', sql.NVarChar, clientData.contacts[i].xfax ? clientData.contacts[i].xfax : null)
                        .input('bnotificacion', sql.Bit, clientData.contacts[i].bnotificacion)
                        .input('cusuariocreacion', sql.Int, clientData.cusuariocreacion)
                        .input('fcreacion', sql.DateTime, new Date())
                        .query('insert into CLCONTACTO (CCLIENTE, XNOMBRE, XAPELLIDO, CTIPODOCIDENTIDAD, XDOCIDENTIDAD, XTELEFONOCELULAR, XEMAIL, XCARGO, XTELEFONOOFICINA, XTELEFONOCASA, XFAX, BNOTIFICACION, CUSUARIOCREACION, FCREACION) values (@ccliente, @xnombre, @xapellido, @ctipodocidentidad, @xdocidentidad, @xtelefonocelular, @xemail, @xcargo, @xtelefonooficina, @xtelefonocasa, @xfax, @bnotificacion, @cusuariocreacion, @fcreacion)')
                }
            }
            if(result.rowsAffected > 0 && clientData.associates){
                for(let i = 0; i < clientData.associates.length; i++){
                    let insert = await pool.request()
                        .input('ccliente', sql.Int, result.recordset[0].CCLIENTE)
                        .input('casociado', sql.Int, clientData.associates[i].casociado)
                        .input('cusuariocreacion', sql.Int, clientData.cusuariocreacion)
                        .input('fcreacion', sql.DateTime, new Date())
                        .query('insert into CLASOCIADO (CCLIENTE, CASOCIADO, CUSUARIOCREACION, FCREACION) values (@ccliente, @casociado, @cusuariocreacion, @fcreacion)')
                }
            }
            if(result.rowsAffected > 0 && clientData.bonds){
                for(let i = 0; i < clientData.bonds.length; i++){
                    let insert = await pool.request()
                        .input('ccliente', sql.Int, result.recordset[0].CCLIENTE)
                        .input('pbono', sql.Numeric(5, 2), clientData.bonds[i].pbono)
                        .input('mbono', sql.Numeric(11, 2), clientData.bonds[i].mbono)
                        .input('fefectiva', sql.DateTime, clientData.bonds[i].fefectiva)
                        .input('cusuariocreacion', sql.Int, clientData.cusuariocreacion)
                        .input('fcreacion', sql.DateTime, new Date())
                        .query('insert into CLBONO (CCLIENTE, PBONO, MBONO, FEFECTIVA, CUSUARIOCREACION, FCREACION) values (@ccliente, @pbono, @mbono, @fefectiva, @cusuariocreacion, @fcreacion)')
                }
            }
            if(result.rowsAffected > 0 && clientData.brokers){
                for(let i = 0; i < clientData.brokers.length; i++){
                    let insert = await pool.request()
                        .input('ccliente', sql.Int, result.recordset[0].CCLIENTE)
                        .input('ccorredor', sql.Int, clientData.brokers[i].ccorredor)
                        .input('pcorredor', sql.Numeric(5, 2), clientData.brokers[i].pcorredor)
                        .input('mcorredor', sql.Numeric(11, 2), clientData.brokers[i].mcorredor)
                        .input('fefectiva', sql.DateTime, clientData.brokers[i].fefectiva)
                        .input('cusuariocreacion', sql.Int, clientData.cusuariocreacion)
                        .input('fcreacion', sql.DateTime, new Date())
                        .query('insert into CLCORREDOR (CCLIENTE, CCORREDOR, PCORREDOR, MCORREDOR, FEFECTIVA, CUSUARIOCREACION, FCREACION) values (@ccliente, @ccorredor, @pcorredor, @mcorredor, @fefectiva, @cusuariocreacion, @fcreacion)')
                }
            }
            if(result.rowsAffected > 0 && clientData.depreciations){
                for(let i = 0; i < clientData.depreciations.length; i++){
                    let insert = await pool.request()
                        .input('ccliente', sql.Int, result.recordset[0].CCLIENTE)
                        .input('cdepreciacion', sql.Int, clientData.depreciations[i].cdepreciacion)
                        .input('pdepreciacion', sql.Numeric(5, 2), clientData.depreciations[i].pdepreciacion)
                        .input('mdepreciacion', sql.Numeric(11, 2), clientData.depreciations[i].mdepreciacion)
                        .input('fefectiva', sql.DateTime, clientData.depreciations[i].fefectiva)
                        .input('cusuariocreacion', sql.Int, clientData.cusuariocreacion)
                        .input('fcreacion', sql.DateTime, new Date())
                        .query('insert into CLDEPRECIACION (CCLIENTE, CDEPRECIACION, PDEPRECIACION, MDEPRECIACION, FEFECTIVA, CUSUARIOCREACION, FCREACION) values (@ccliente, @cdepreciacion, @pdepreciacion, @mdepreciacion, @fefectiva, @cusuariocreacion, @fcreacion)')
                }
            }
            if(result.rowsAffected > 0 && clientData.relationships){
                for(let i = 0; i < clientData.relationships.length; i++){
                    let insert = await pool.request()
                        .input('ccliente', sql.Int, result.recordset[0].CCLIENTE)
                        .input('cparentesco', sql.Int, clientData.relationships[i].cparentesco)
                        .input('xobservacion', sql.NVarChar, clientData.relationships[i].xobservacion)
                        .input('fefectiva', sql.DateTime, clientData.relationships[i].fefectiva)
                        .input('cusuariocreacion', sql.Int, clientData.cusuariocreacion)
                        .input('fcreacion', sql.DateTime, new Date())
                        .query('insert into CLPARENTESCO (CCLIENTE, CPARENTESCO, XOBSERVACION, FEFECTIVA, CUSUARIOCREACION, FCREACION) values (@ccliente, @cparentesco, @xobservacion, @fefectiva, @cusuariocreacion, @fcreacion)')
                }
            }
            if(result.rowsAffected > 0 && clientData.penalties){
                for(let i = 0; i < clientData.penalties.length; i++){
                    let insert = await pool.request()
                        .input('ccliente', sql.Int, result.recordset[0].CCLIENTE)
                        .input('cpenalizacion', sql.Int, clientData.penalties[i].cpenalizacion)
                        .input('ppenalizacion', sql.Numeric(5, 2), clientData.penalties[i].ppenalizacion)
                        .input('mpenalizacion', sql.Numeric(11, 2), clientData.penalties[i].mpenalizacion)
                        .input('fefectiva', sql.DateTime, clientData.penalties[i].fefectiva)
                        .input('cusuariocreacion', sql.Int, clientData.cusuariocreacion)
                        .input('fcreacion', sql.DateTime, new Date())
                        .query('insert into CLPENALIZACION (CCLIENTE, CPENALIZACION, PPENALIZACION, MPENALIZACION, FEFECTIVA, CUSUARIOCREACION, FCREACION) values (@ccliente, @cpenalizacion, @ppenalizacion, @mpenalizacion, @fefectiva, @cusuariocreacion, @fcreacion)')
                }
            }
            if(result.rowsAffected > 0 && clientData.providers){
                for(let i = 0; i < clientData.providers.length; i++){
                    let insert = await pool.request()
                        .input('ccliente', sql.Int, result.recordset[0].CCLIENTE)
                        .input('cproveedor', sql.Int, clientData.providers[i].cproveedor)
                        .input('xobservacion', sql.NVarChar, clientData.providers[i].xobservacion)
                        .input('fefectiva', sql.DateTime, clientData.providers[i].fefectiva)
                        .input('cusuariocreacion', sql.Int, clientData.cusuariocreacion)
                        .input('fcreacion', sql.DateTime, new Date())
                        .query('insert into CLPROVEEDOREXCLUIDO (CCLIENTE, CPROVEEDOR, XOBSERVACION, FEFECTIVA, CUSUARIOCREACION, FCREACION) values (@ccliente, @cproveedor, @xobservacion, @fefectiva, @cusuariocreacion, @fcreacion)')
                }
            }
            if(result.rowsAffected > 0 && clientData.models){
                for(let i = 0; i < clientData.models.length; i++){
                    let insert = await pool.request()
                        .input('ccliente', sql.Int, result.recordset[0].CCLIENTE)
                        .input('cmodelo', sql.Int, clientData.models[i].cmodelo)
                        .input('cmarca', sql.Int, clientData.models[i].cmarca)
                        .input('xobservacion', sql.NVarChar, clientData.models[i].xobservacion)
                        .input('cusuariocreacion', sql.Int, clientData.cusuariocreacion)
                        .input('fcreacion', sql.DateTime, new Date())
                        .query('insert into CLMODELOEXCLUIDO (CCLIENTE, CMODELO, CMARCA, XOBSERVACION, CUSUARIOCREACION, FCREACION) values (@ccliente, @cmodelo, @cmarca, @xobservacion, @cusuariocreacion, @fcreacion)')
                }
            }
            if(result.rowsAffected > 0 && clientData.workers){
                for(let i = 0; i < clientData.workers.length; i++){
                    let insert = await pool.request()
                        .input('ccliente', sql.Int, result.recordset[0].CCLIENTE)
                        .input('xnombre', sql.NVarChar, clientData.workers[i].xnombre)
                        .input('xapellido', sql.NVarChar, clientData.workers[i].xapellido)
                        .input('ctipodocidentidad', sql.Int,  clientData.workers[i].ctipodocidentidad)
                        .input('xdocidentidad', sql.NVarChar, clientData.workers[i].xdocidentidad)
                        .input('xtelefonocelular', sql.NVarChar, clientData.workers[i].xtelefonocelular)
                        .input('xemail', sql.NVarChar, clientData.workers[i].xemail)
                        .input('xprofesion', sql.NVarChar, clientData.workers[i].xprofesion ? clientData.workers[i].xprofesion : null)
                        .input('xocupacion', sql.NVarChar, clientData.workers[i].xocupacion ? clientData.workers[i].xocupacion : null)
                        .input('xtelefonocasa', sql.NVarChar, clientData.workers[i].xtelefonocasa ? clientData.workers[i].xtelefonocasa : null)
                        .input('xfax', sql.NVarChar, clientData.workers[i].xfax ? clientData.workers[i].xfax : null)
                        .input('cparentesco', sql.Int, clientData.workers[i].cparentesco)
                        .input('cestadocivil', sql.Int, clientData.workers[i].cestadocivil)
                        .input('fnacimiento', sql.DateTime, clientData.workers[i].fnacimiento)
                        .input('xdireccion', sql.NVarChar, clientData.workers[i].xdireccion)
                        .input('cestado', sql.Int, clientData.workers[i].cestado)
                        .input('cciudad', sql.Int, clientData.workers[i].cciudad)
                        .input('cusuariocreacion', sql.Int, clientData.cusuariocreacion)
                        .input('fcreacion', sql.DateTime, new Date())
                        .query('insert into CLTRABAJADOR (CCLIENTE, XNOMBRE, XAPELLIDO, CTIPODOCIDENTIDAD, XDOCIDENTIDAD, XTELEFONOCELULAR, XEMAIL, XPROFESION, XOCUPACION, XTELEFONOCASA, XFAX, CPARENTESCO, CESTADOCIVIL, FNACIMIENTO, XDIRECCION, CESTADO, CCIUDAD, CUSUARIOCREACION, FCREACION) values (@ccliente, @xnombre, @xapellido, @ctipodocidentidad, @xdocidentidad, @xtelefonocelular, @xemail, @xprofesion, @xocupacion, @xtelefonocasa, @xfax, @cparentesco, @cestadocivil, @fnacimiento, @xdireccion, @cestado, @cciudad, @cusuariocreacion, @fcreacion)')
                }
            }
            if(result.rowsAffected > 0 && clientData.documents){
                for(let i = 0; i < clientData.documents.length; i++){
                    let insert = await pool.request()
                        .input('ccliente', sql.Int, result.recordset[0].CCLIENTE)
                        .input('cdocumento', sql.Int, clientData.documents[i].cdocumento)
                        .input('xrutaarchivo', sql.NVarChar, clientData.documents[i].xrutaarchivo)
                        .input('cusuariocreacion', sql.Int, clientData.cusuariocreacion)
                        .input('fcreacion', sql.DateTime, new Date())
                        .query('insert into CLDOCUMENTO (CCLIENTE, CDOCUMENTO, XRUTAARCHIVO, CUSUARIOCREACION, FCREACION) values (@ccliente, @cdocumento, @xrutaarchivo, @cusuariocreacion, @fcreacion)')
                }
            }
            if(result.rowsAffected > 0 && clientData.groupers){
                for(let i = 0; i < clientData.groupers.length; i++){
                    let insert = await pool.request()
                        .input('ccliente', sql.Int, result.recordset[0].CCLIENTE)
                        .input('xcontratoalternativo', sql.NVarChar, clientData.groupers[i].xcontratoalternativo)
                        .input('xnombre', sql.NVarChar, clientData.groupers[i].xnombre)
                        .input('xrazonsocial', sql.NVarChar, clientData.groupers[i].xrazonsocial)
                        .input('cestado', sql.Int, clientData.groupers[i].cestado)
                        .input('cciudad', sql.Int, clientData.groupers[i].cciudad)
                        .input('xdireccionfiscal', sql.NVarChar, clientData.groupers[i].xdireccionfiscal)
                        .input('ctipodocidentidad', sql.Int, clientData.groupers[i].ctipodocidentidad)
                        .input('xdocidentidad', sql.NVarChar, clientData.groupers[i].xdocidentidad)
                        .input('bfacturar', sql.Bit, clientData.groupers[i].bfacturar)
                        .input('bcontribuyente', sql.Bit, clientData.groupers[i].bcontribuyente)
                        .input('bimpuesto', sql.Bit, clientData.groupers[i].bimpuesto)
                        .input('xtelefono', sql.NVarChar, clientData.groupers[i].xtelefono)
                        .input('xfax', sql.NVarChar, clientData.groupers[i].xfax ? clientData.groupers[i].xfax : null)
                        .input('xemail', sql.NVarChar, clientData.groupers[i].xemail)
                        .input('xrutaimagen', sql.NVarChar, clientData.groupers[i].xrutaimagen ? clientData.groupers[i].xrutaimagen : null)
                        .input('bactivo', sql.Bit, clientData.groupers[i].bactivo)
                        .input('cusuariocreacion', sql.Int, clientData.cusuariocreacion)
                        .input('fcreacion', sql.DateTime, new Date())
                        .query('insert into CLAGRUPADOR (CCLIENTE, XCONTRATOALTERNATIVO, XNOMBRE, XRAZONSOCIAL, CESTADO, CCIUDAD, XDIRECCIONFISCAL, CTIPODOCIDENTIDAD, XDOCIDENTIDAD, BFACTURAR, BCONTRIBUYENTE, BIMPUESTO, XTELEFONO, XFAX, XEMAIL, XRUTAIMAGEN, BACTIVO, CUSUARIOCREACION, FCREACION) output inserted.CAGRUPADOR values (@ccliente, @xcontratoalternativo, @xnombre, @xrazonsocial, @cestado, @cciudad, @xdireccionfiscal, @ctipodocidentidad, @xdocidentidad, @bfacturar, @bcontribuyente, @bimpuesto, @xtelefono, @xfax, @xemail, @xrutaimagen, @bactivo, @cusuariocreacion, @fcreacion)')
                    if(clientData.groupers[i].banks){
                        for(let j = 0; j < clientData.groupers[i].banks.length; j++){
                            let subInsert = await pool.request()
                                .input('cagrupador', sql.Int, insert.recordset[0].CAGRUPADOR)
                                .input('cbanco', sql.Int, clientData.groupers[i].banks[j].cbanco)
                                .input('ctipocuentabancaria', sql.Int, clientData.groupers[i].banks[j].ctipocuentabancaria)
                                .input('xnumerocuenta', sql.NVarChar, clientData.groupers[i].banks[j].xnumerocuenta)
                                .input('xcontrato', sql.NVarChar, clientData.groupers[i].banks[j].xcontrato)
                                .input('bprincipal', sql.Bit, clientData.groupers[i].banks[j].bprincipal)
                                .input('cusuariocreacion', sql.Int, clientData.cusuariocreacion)
                                .input('fcreacion', sql.DateTime, new Date())
                                .query('insert into CLBANCOAGRUPADOR (CAGRUPADOR, CBANCO, CTIPOCUENTABANCARIA, XNUMEROCUENTA, XCONTRATO, BPRINCIPAL, CUSUARIOCREACION, FCREACION) values (@cagrupador, @cbanco, @ctipocuentabancaria, @xnumerocuenta, @xcontrato, @bprincipal, @cusuariocreacion, @fcreacion)')
                        }
                    }
                }
            }
            if(result.rowsAffected > 0 && clientData.plans){
                for(let i = 0; i < clientData.plans.length; i++){
                    let insert = await pool.request()
                        .input('ccliente', sql.Int, result.recordset[0].CCLIENTE)
                        .input('casociado', sql.Int, clientData.plans[i].casociado)
                        .input('ctipoplan', sql.Int, clientData.plans[i].ctipoplan)
                        .input('cplan', sql.Int, clientData.plans[i].cplan)
                        .input('fdesde', sql.DateTime, clientData.plans[i].fdesde)
                        .input('fhasta', sql.DateTime, clientData.plans[i].fhasta)
                        .input('cusuariocreacion', sql.Int, clientData.cusuariocreacion)
                        .input('fcreacion', sql.DateTime, new Date())
                        .query('insert into CLPLAN (CCLIENTE, CASOCIADO, CTIPOPLAN, CPLAN, FDESDE, FHASTA, CUSUARIOCREACION, FCREACION) values (@ccliente, @casociado, @ctipoplan, @cplan, @fdesde, @fhasta, @cusuariocreacion, @fcreacion)')
                }
            }
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    getContractClientData: async(ccliente) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('ccliente', sql.Int, ccliente)
                .query('select * from VWBUSCARCLIENTEXCONTRATOFLOTADATA where CCLIENTE = @ccliente');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    getClientData: async(ccliente) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('ccliente', sql.Int, ccliente)
                .query('select * from CLCLIENTE where CCLIENTE = @ccliente');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    getClientDataQuery: async(clientData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cpais', sql.Numeric(4, 0), clientData.cpais)
                .input('ccompania', sql.Int, clientData.ccompania)
                .input('ccliente', sql.Int, clientData.ccliente)
                .query('select * from CLCLIENTE where CCLIENTE = @ccliente and CPAIS = @cpais and CCOMPANIA = @ccompania');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    getClientBanksDataQuery: async(ccliente) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('ccliente', sql.Int, ccliente)
                .query('select * from VWBUSCARBANCOXCLIENTEDATA where CCLIENTE = @ccliente');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    getClientAssociatesDataQuery: async(ccliente) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('ccliente', sql.Int, ccliente)
                .query('select * from VWBUSCARASOCIADOXCLIENTEDATA where CCLIENTE = @ccliente');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    getClientBondsDataQuery: async(ccliente) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('ccliente', sql.Int, ccliente)
                .query('select * from CLBONO where CCLIENTE = @ccliente');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    getClientContactsDataQuery: async(ccliente) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('ccliente', sql.Int, ccliente)
                .query('select * from CLCONTACTO where CCLIENTE = @ccliente');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    getClientBrokersDataQuery: async(ccliente) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('ccliente', sql.Int, ccliente)
                .query('select * from VWBUSCARCORREDORXCLIENTEDATA where CCLIENTE = @ccliente');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    getClientDepreciationsDataQuery: async(ccliente) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('ccliente', sql.Int, ccliente)
                .query('select * from VWBUSCARDEPRECIACIONXCLIENTEDATA where CCLIENTE = @ccliente');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    getClientRelationshipsDataQuery: async(ccliente) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('ccliente', sql.Int, ccliente)
                .query('select * from VWBUSCARPARENTESCOXCLIENTEDATA where CCLIENTE = @ccliente');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    getClientPenaltiesDataQuery: async(ccliente) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('ccliente', sql.Int, ccliente)
                .query('select * from VWBUSCARPENALIZACIONXCLIENTEDATA where CCLIENTE = @ccliente');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    getClientProvidersDataQuery: async(ccliente) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('ccliente', sql.Int, ccliente)
                .query('select * from VWBUSCARPROVEEDOREXCLUIDOXCLIENTEDATA where CCLIENTE = @ccliente');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    getClientModelsDataQuery: async(ccliente) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('ccliente', sql.Int, ccliente)
                .query('select * from VWBUSCARMODELOEXCLUIDOXCLIENTEDATA where CCLIENTE = @ccliente');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    getClientWorkersDataQuery: async(ccliente) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('ccliente', sql.Int, ccliente)
                .query('select * from CLTRABAJADOR where CCLIENTE = @ccliente');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    getClientDocumentsDataQuery: async(ccliente) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('ccliente', sql.Int, ccliente)
                .query('select * from VWBUSCARDOCUMENTOXCLIENTEDATA where CCLIENTE = @ccliente');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    getClientGroupersDataQuery: async(ccliente) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('ccliente', sql.Int, ccliente)
                .query('select * from CLAGRUPADOR where CCLIENTE = @ccliente');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    getGrouperBanksDataQuery: async(cagrupador) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cagrupador', sql.Int, cagrupador)
                .query('select * from VWBUSCARBANCOXAGRUPADORDATA where CAGRUPADOR = @cagrupador');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    getClientPlansDataQuery: async(ccliente) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('ccliente', sql.Int, ccliente)
                .query('select * from VWBUSCARPLANXCLIENTEDATA where CCLIENTE = @ccliente');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    verifyClientIdentificationToUpdateQuery: async(clientData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cpais', sql.Numeric(4, 0), clientData.cpais)
                .input('ccompania', sql.Int, clientData.ccompania)
                .input('ccliente', sql.Int, clientData.ccliente)
                .input('ctipodocidentidad', sql.Int, clientData.ctipodocidentidad)
                .input('xdocidentidad', sql.NVarChar, clientData.xdocidentidad)
                .query('select * from CLCLIENTE where XDOCIDENTIDAD = @xdocidentidad and CTIPODOCIDENTIDAD = @ctipodocidentidad and CPAIS = @cpais and CCOMPANIA = @ccompania and CCLIENTE != @ccliente');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    updateClientQuery: async(clientData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cpais', sql.Numeric(4, 0), clientData.cpais)
                .input('ccompania', sql.Int, clientData.ccompania)
                .input('ccliente', sql.Int, clientData.ccliente)
                .input('xcliente', sql.NVarChar, clientData.xcliente)
                .input('xcontrato', sql.NVarChar, clientData.xcontrato)
                .input('xrepresentante', sql.NVarChar, clientData.xrepresentante)
                .input('cempresa', sql.Int, clientData.cempresa)
                .input('cactividadempresa', sql.Int, clientData.cactividadempresa)
                .input('ctipodocidentidad', sql.Int, clientData.ctipodocidentidad)
                .input('xdocidentidad', sql.NVarChar, clientData.xdocidentidad)
                .input('cestado', sql.Int, clientData.cestado)
                .input('cciudad', sql.Int, clientData.cciudad)
                .input('xdireccionfiscal', sql.NVarChar, clientData.xdireccionfiscal)
                .input('xemail', sql.NVarChar, clientData.xemail)
                .input('fanomaximo', sql.Int, clientData.fanomaximo)
                .input('finicio', sql.DateTime, clientData.finicio)
                .input('xtelefono', sql.NVarChar, clientData.xtelefono ? clientData.xtelefono : null)
                .input('bcolectivo', sql.Bit, clientData.bcolectivo)
                .input('bfacturar', sql.Bit, clientData.bfacturar)
                .input('bfinanciar', sql.Bit, clientData.bfinanciar)
                .input('bcontribuyente', sql.Bit, clientData.bcontribuyente)
                .input('bimpuesto', sql.Bit, clientData.bimpuesto)
                .input('bnotificacionsms', sql.Bit, clientData.bnotificacionsms)
                .input('xpaginaweb', sql.NVarChar, clientData.xpaginaweb ? clientData.xpaginaweb : null)
                .input('ctipopago', sql.Int, clientData.ctipopago)
                .input('xrutaimagen', sql.NVarChar, clientData.xrutaimagen ? clientData.xrutaimagen : null)
                .input('ifacturacion', sql.NChar, clientData.ifacturacion)
                .input('bactivo', sql.Bit, clientData.bactivo)
                .input('cusuariomodificacion', sql.Int, clientData.cusuariomodificacion)
                .input('fmodificacion', sql.DateTime, new Date())
                .query('update CLCLIENTE set XCLIENTE = @xcliente, XCONTRATO = @xcontrato, XREPRESENTANTE = @xrepresentante, CEMPRESA = @cempresa, CACTIVIDADEMPRESA = @cactividadempresa, CTIPODOCIDENTIDAD = @ctipodocidentidad, XDOCIDENTIDAD = @xdocidentidad, CESTADO = @cestado, CCIUDAD = @cciudad, XDIRECCIONFISCAL = @xdireccionfiscal, XEMAIL = @xemail, FANOMAXIMO = @fanomaximo, FINICIO = @finicio, XTELEFONO = @xtelefono, BCOLECTIVO = @bcolectivo, BFACTURAR = @bfacturar, BFINANCIAR = @bfinanciar, BCONTRIBUYENTE = @bcontribuyente, BIMPUESTO = @bimpuesto, BNOTIFICACIONSMS = @bnotificacionsms, XPAGINAWEB = @xpaginaweb, CTIPOPAGO = @ctipopago, XRUTAIMAGEN = @xrutaimagen, IFACTURACION = @ifacturacion, BACTIVO = @bactivo, CUSUARIOMODIFICACION = @cusuariomodificacion, FMODIFICACION = @fmodificacion where CCLIENTE = @ccliente and CPAIS = @cpais and CCOMPANIA = @ccompania');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    createBanksByClientUpdateQuery: async(banks, clientData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < banks.length; i++){
                let insert = await pool.request()
                    .input('ccliente', sql.Int, clientData.ccliente)
                    .input('cbanco', sql.Int, banks[i].cbanco)
                    .input('ctipocuentabancaria', sql.Int, banks[i].ctipocuentabancaria)
                    .input('xnumerocuenta', sql.NVarChar, banks[i].xnumerocuenta)
                    .input('xcontrato', sql.NVarChar, banks[i].xcontrato)
                    .input('bprincipal', sql.Bit, banks[i].bprincipal)
                    .input('cusuariocreacion', sql.Int, clientData.cusuariomodificacion)
                    .input('fcreacion', sql.DateTime, new Date())
                    .query('insert into CLBANCO (CCLIENTE, CBANCO, CTIPOCUENTABANCARIA, XNUMEROCUENTA, XCONTRATO, BPRINCIPAL, CUSUARIOCREACION, FCREACION) values (@ccliente, @cbanco, @ctipocuentabancaria, @xnumerocuenta, @xcontrato, @bprincipal, @cusuariocreacion, @fcreacion)')
                rowsAffected = rowsAffected + insert.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    updateBanksByClientUpdateQuery: async(banks, clientData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < banks.length; i++){
                let update = await pool.request()
                    .input('ccliente', sql.Int, clientData.ccliente)
                    .input('cbanco', sql.Int, banks[i].cbanco)
                    .input('ctipocuentabancaria', sql.Int, banks[i].ctipocuentabancaria)
                    .input('xnumerocuenta', sql.NVarChar, banks[i].xnumerocuenta)
                    .input('xcontrato', sql.NVarChar, banks[i].xcontrato)
                    .input('bprincipal', sql.Bit, banks[i].bprincipal)
                    .input('cusuariomodificacion', sql.Int, clientData.cusuariomodificacion)
                    .input('fmodificacion', sql.DateTime, new Date())
                    .query('update CLBANCO set CTIPOCUENTABANCARIA = @ctipocuentabancaria, XNUMEROCUENTA = @xnumerocuenta, XCONTRATO = @xcontrato, BPRINCIPAL = @bprincipal, CUSUARIOMODIFICACION = @cusuariomodificacion, FMODIFICACION = @fmodificacion where CBANCO = @cbanco and CCLIENTE = @ccliente');
                rowsAffected = rowsAffected + update.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    deleteBanksByClientUpdateQuery: async(banks, clientData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < banks.length; i++){
                let erase = await pool.request()
                    .input('ccliente', sql.Int, clientData.ccliente)
                    .input('cbanco', sql.Int, banks[i].cbanco)
                    .query('delete from CLBANCO where CBANCO = @cbanco and CCLIENTE = @ccliente');
                rowsAffected = rowsAffected + erase.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    createAssociatesByClientUpdateQuery: async(associates, clientData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < associates.length; i++){
                let insert = await pool.request()
                    .input('ccliente', sql.Int, clientData.ccliente)
                    .input('casociado', sql.Int, associates[i].casociado)
                    .input('cusuariocreacion', sql.Int, clientData.cusuariomodificacion)
                    .input('fcreacion', sql.DateTime, new Date())
                    .query('insert into CLASOCIADO (CCLIENTE, CASOCIADO, CUSUARIOCREACION, FCREACION) values (@ccliente, @casociado, @cusuariocreacion, @fcreacion)')
                rowsAffected = rowsAffected + insert.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    updateAssociatesByClientUpdateQuery: async(associates, clientData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < associates.length; i++){
                let update = await pool.request()
                    .input('ccliente', sql.Int, clientData.ccliente)
                    .input('casociado', sql.Int, associates[i].casociado)
                    .input('cusuariomodificacion', sql.Int, clientData.cusuariomodificacion)
                    .input('fmodificacion', sql.DateTime, new Date())
                    .query('update CLASOCIADO set CUSUARIOMODIFICACION = @cusuariomodificacion, FMODIFICACION = @fmodificacion where CASOCIADO = @casociado and CCLIENTE = @ccliente');
                rowsAffected = rowsAffected + update.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    deleteAssociatesByClientUpdateQuery: async(associates, clientData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < associates.length; i++){
                let erase = await pool.request()
                    .input('ccliente', sql.Int, clientData.ccliente)
                    .input('casociado', sql.Int, associates[i].casociado)
                    .query('delete from CLASOCIADO where CASOCIADO = @casociado and CCLIENTE = @ccliente');
                rowsAffected = rowsAffected + erase.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    createBondsByClientUpdateQuery: async(bonds, clientData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < bonds.length; i++){
                let insert = await pool.request()
                    .input('ccliente', sql.Int, clientData.ccliente)
                    .input('pbono', sql.Numeric(5, 2), bonds[i].pbono)
                    .input('mbono', sql.Numeric(11, 2), bonds[i].mbono)
                    .input('fefectiva', sql.DateTime, bonds[i].fefectiva)
                    .input('cusuariocreacion', sql.Int, clientData.cusuariomodificacion)
                    .input('fcreacion', sql.DateTime, new Date())
                    .query('insert into CLBONO (CCLIENTE, PBONO, MBONO, FEFECTIVA, CUSUARIOCREACION, FCREACION) values (@ccliente, @pbono, @mbono, @fefectiva, @cusuariocreacion, @fcreacion)')
                rowsAffected = rowsAffected + insert.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    updateBondsByClientUpdateQuery: async(bonds, clientData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < bonds.length; i++){
                let update = await pool.request()
                    .input('ccliente', sql.Int, clientData.ccliente)
                    .input('cbono', sql.Int, bonds[i].cbono)
                    .input('pbono', sql.Numeric(5, 2), bonds[i].pbono)
                    .input('mbono', sql.Numeric(11, 2), bonds[i].mbono)
                    .input('fefectiva', sql.DateTime, bonds[i].fefectiva)
                    .input('cusuariomodificacion', sql.Int, clientData.cusuariomodificacion)
                    .input('fmodificacion', sql.DateTime, new Date())
                    .query('update CLBONO set PBONO = @pbono, MBONO = @mbono, FEFECTIVA = @fefectiva, CUSUARIOMODIFICACION = @cusuariomodificacion, FMODIFICACION = @fmodificacion where CBONO = @cbono and CCLIENTE = @ccliente');
                rowsAffected = rowsAffected + update.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    deleteBondsByClientUpdateQuery: async(bonds, clientData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < bonds.length; i++){
                let erase = await pool.request()
                    .input('ccliente', sql.Int, clientData.ccliente)
                    .input('cbono', sql.Int, bonds[i].cbono)
                    .query('delete from CLBONO where CBONO = @cbono and CCLIENTE = @ccliente');
                rowsAffected = rowsAffected + erase.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    createContactsByClientUpdateQuery: async(contacts, clientData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < contacts.length; i++){
                let insert = await pool.request()
                    .input('ccliente', sql.Int, clientData.ccliente)
                    .input('xnombre', sql.NVarChar, contacts[i].xnombre)
                    .input('xapellido', sql.NVarChar, contacts[i].xapellido)
                    .input('ctipodocidentidad', sql.Int, contacts[i].ctipodocidentidad)
                    .input('xdocidentidad', sql.NVarChar, contacts[i].xdocidentidad)
                    .input('xtelefonocelular', sql.NVarChar, contacts[i].xtelefonocelular)
                    .input('xemail', sql.NVarChar, contacts[i].xemail)
                    .input('xcargo', sql.NVarChar, contacts[i].xcargo ? contacts[i].xcargo : null)
                    .input('xfax', sql.NVarChar, contacts[i].xfax ? contacts[i].xfax : null)
                    .input('xtelefonooficina', sql.NVarChar, contacts[i].xtelefonooficina ? contacts[i].xtelefonooficina : null)
                    .input('xtelefonocasa', sql.NVarChar, contacts[i].xtelefonocasa ? contacts[i].xtelefonocasa : null)
                    .input('bnotificacion', sql.Bit, contacts[i].bnotificacion)
                    .input('cusuariocreacion', sql.Int, clientData.cusuariomodificacion)
                    .input('fcreacion', sql.DateTime, new Date())
                    .query('insert into CLCONTACTO (CCLIENTE, XNOMBRE, XAPELLIDO, CTIPODOCIDENTIDAD, XDOCIDENTIDAD, XTELEFONOCELULAR, XEMAIL, XCARGO, XFAX, XTELEFONOOFICINA, XTELEFONOCASA, BNOTIFICACION, CUSUARIOCREACION, FCREACION) values (@ccliente, @xnombre, @xapellido, @ctipodocidentidad, @xdocidentidad, @xtelefonocelular, @xemail, @xcargo, @xfax, @xtelefonooficina, @xtelefonocasa, @bnotificacion, @cusuariocreacion, @fcreacion)')
                rowsAffected = rowsAffected + insert.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    updateContactsByClientUpdateQuery: async(contacts, clientData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < contacts.length; i++){
                let update = await pool.request()
                    .input('ccliente', sql.Int, clientData.ccliente)
                    .input('ccontacto', sql.Int, contacts[i].ccontacto)
                    .input('xnombre', sql.NVarChar, contacts[i].xnombre)
                    .input('xapellido', sql.NVarChar, contacts[i].xapellido)
                    .input('ctipodocidentidad', sql.Int, contacts[i].ctipodocidentidad)
                    .input('xdocidentidad', sql.NVarChar, contacts[i].xdocidentidad)
                    .input('xtelefonocelular', sql.NVarChar, contacts[i].xtelefonocelular)
                    .input('xemail', sql.NVarChar, contacts[i].xemail)
                    .input('xcargo', sql.NVarChar, contacts[i].xcargo ? contacts[i].xcargo : null)
                    .input('xfax', sql.NVarChar, contacts[i].xfax ? contacts[i].xfax : null)
                    .input('xtelefonooficina', sql.NVarChar, contacts[i].xtelefonooficina ? contacts[i].xtelefonooficina : null)
                    .input('xtelefonocasa', sql.NVarChar, contacts[i].xtelefonocasa ? contacts[i].xtelefonocasa : null)
                    .input('bnotificacion', sql.Bit, contacts[i].bnotificacion)
                    .input('cusuariomodificacion', sql.Int, clientData.cusuariomodificacion)
                    .input('fmodificacion', sql.DateTime, new Date())
                    .query('update CLCONTACTO set XNOMBRE = @xnombre, XAPELLIDO = @xapellido, CTIPODOCIDENTIDAD = @ctipodocidentidad, XDOCIDENTIDAD = @xdocidentidad, XTELEFONOCELULAR = @xtelefonocelular, XEMAIL = @xemail, XCARGO = @xcargo, XFAX = @xfax, XTELEFONOOFICINA = @xtelefonooficina, XTELEFONOCASA = @xtelefonocasa, BNOTIFICACION = @bnotificacion, CUSUARIOMODIFICACION = @cusuariomodificacion, FMODIFICACION = @fmodificacion where CCONTACTO = @ccontacto and CCLIENTE = @ccliente');
                rowsAffected = rowsAffected + update.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    deleteContactsByClientUpdateQuery: async(contacts, clientData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < contacts.length; i++){
                let erase = await pool.request()
                    .input('ccliente', sql.Int, clientData.ccliente)
                    .input('ccontacto', sql.Int, contacts[i].ccontacto)
                    .query('delete from CLCONTACTO where CCONTACTO = @ccontacto and CCLIENTE = @ccliente');
                rowsAffected = rowsAffected + erase.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    createBrokersByClientUpdateQuery: async(brokers, clientData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < brokers.length; i++){
                let insert = await pool.request()
                    .input('ccliente', sql.Int, clientData.ccliente)
                    .input('ccorredor', sql.Int, brokers[i].ccorredor)
                    .input('pcorredor', sql.Numeric(5, 2), brokers[i].pcorredor)
                    .input('mcorredor', sql.Numeric(11, 2), brokers[i].mcorredor)
                    .input('fefectiva', sql.DateTime, brokers[i].fefectiva)
                    .input('cusuariocreacion', sql.Int, clientData.cusuariomodificacion)
                    .input('fcreacion', sql.DateTime, new Date())
                    .query('insert into CLCORREDOR (CCLIENTE, CCORREDOR, PCORREDOR, MCORREDOR, FEFECTIVA, CUSUARIOCREACION, FCREACION) values (@ccliente, @ccorredor, @pcorredor, @mcorredor, @fefectiva, @cusuariocreacion, @fcreacion)')
                rowsAffected = rowsAffected + insert.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    updateBrokersByClientUpdateQuery: async(brokers, clientData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < brokers.length; i++){
                let update = await pool.request()
                    .input('ccliente', sql.Int, clientData.ccliente)
                    .input('ccorredor', sql.Int, brokers[i].ccorredor)
                    .input('pcorredor', sql.Numeric(5, 2), brokers[i].pcorredor)
                    .input('mcorredor', sql.Numeric(11, 2), brokers[i].mcorredor)
                    .input('fefectiva', sql.DateTime, brokers[i].fefectiva)
                    .input('cusuariomodificacion', sql.Int, clientData.cusuariomodificacion)
                    .input('fmodificacion', sql.DateTime, new Date())
                    .query('update CLCORREDOR set PCORREDOR = @pcorredor, MCORREDOR = @mcorredor, FEFECTIVA = @fefectiva, CUSUARIOMODIFICACION = @cusuariomodificacion, FMODIFICACION = @fmodificacion where CCORREDOR = @ccorredor and CCLIENTE = @ccliente');
                rowsAffected = rowsAffected + update.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    deleteBrokersByClientUpdateQuery: async(brokers, clientData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < brokers.length; i++){
                let erase = await pool.request()
                    .input('ccliente', sql.Int, clientData.ccliente)
                    .input('ccorredor', sql.Int, brokers[i].ccorredor)
                    .query('delete from CLCORREDOR where CCORREDOR = @ccorredor and CCLIENTE = @ccliente');
                rowsAffected = rowsAffected + erase.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    createDepreciationsByClientUpdateQuery: async(depreciations, clientData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < depreciations.length; i++){
                let insert = await pool.request()
                    .input('ccliente', sql.Int, clientData.ccliente)
                    .input('cdepreciacion', sql.Int, depreciations[i].cdepreciacion)
                    .input('pdepreciacion', sql.Numeric(5, 2), depreciations[i].pdepreciacion)
                    .input('mdepreciacion', sql.Numeric(11, 2), depreciations[i].mdepreciacion)
                    .input('fefectiva', sql.DateTime, depreciations[i].fefectiva)
                    .input('cusuariocreacion', sql.Int, clientData.cusuariomodificacion)
                    .input('fcreacion', sql.DateTime, new Date())
                    .query('insert into CLDEPRECIACION (CCLIENTE, CDEPRECIACION, PDEPRECIACION, MDEPRECIACION, FEFECTIVA, CUSUARIOCREACION, FCREACION) values (@ccliente, @cdepreciacion, @pdepreciacion, @mdepreciacion, @fefectiva, @cusuariocreacion, @fcreacion)')
                rowsAffected = rowsAffected + insert.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    updateDepreciationsByClientUpdateQuery: async(depreciations, clientData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < depreciations.length; i++){
                let update = await pool.request()
                    .input('ccliente', sql.Int, clientData.ccliente)
                    .input('cdepreciacion', sql.Int, depreciations[i].cdepreciacion)
                    .input('pdepreciacion', sql.Numeric(5, 2), depreciations[i].pdepreciacion)
                    .input('mdepreciacion', sql.Numeric(11, 2), depreciations[i].mdepreciacion)
                    .input('fefectiva', sql.DateTime, depreciations[i].fefectiva)
                    .input('cusuariomodificacion', sql.Int, clientData.cusuariomodificacion)
                    .input('fmodificacion', sql.DateTime, new Date())
                    .query('update CLDEPRECIACION set PDEPRECIACION = @pdepreciacion, MDEPRECIACION = @mdepreciacion, FEFECTIVA = @fefectiva, CUSUARIOMODIFICACION = @cusuariomodificacion, FMODIFICACION = @fmodificacion where CDEPRECIACION = @cdepreciacion and CCLIENTE = @ccliente');
                rowsAffected = rowsAffected + update.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    deleteDepreciationsByClientUpdateQuery: async(depreciations, clientData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < depreciations.length; i++){
                let erase = await pool.request()
                    .input('ccliente', sql.Int, clientData.ccliente)
                    .input('cdepreciacion', sql.Int, depreciations[i].cdepreciacion)
                    .query('delete from CLDEPRECIACION where CDEPRECIACION = @cdepreciacion and CCLIENTE = @ccliente');
                rowsAffected = rowsAffected + erase.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    createRelationshipsByClientUpdateQuery: async(relationships, clientData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < relationships.length; i++){
                let insert = await pool.request()
                    .input('ccliente', sql.Int, clientData.ccliente)
                    .input('cparentesco', sql.Int, relationships[i].cparentesco)
                    .input('xobservacion', sql.NVarChar, relationships[i].xobservacion)
                    .input('fefectiva', sql.DateTime, relationships[i].fefectiva)
                    .input('cusuariocreacion', sql.Int, clientData.cusuariomodificacion)
                    .input('fcreacion', sql.DateTime, new Date())
                    .query('insert into CLPARENTESCO (CCLIENTE, CPARENTESCO, XOBSERVACION, FEFECTIVA, CUSUARIOCREACION, FCREACION) values (@ccliente, @cparentesco, @xobservacion, @fefectiva, @cusuariocreacion, @fcreacion)')
                rowsAffected = rowsAffected + insert.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    updateRelationshipsByClientUpdateQuery: async(relationships, clientData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < relationships.length; i++){
                let update = await pool.request()
                    .input('ccliente', sql.Int, clientData.ccliente)
                    .input('cparentesco', sql.Int, relationships[i].cparentesco)
                    .input('xobservacion', sql.NVarChar, relationships[i].xobservacion)
                    .input('fefectiva', sql.DateTime, relationships[i].fefectiva)
                    .input('cusuariomodificacion', sql.Int, clientData.cusuariomodificacion)
                    .input('fmodificacion', sql.DateTime, new Date())
                    .query('update CLPARENTESCO set XOBSERVACION = @xobservacion, FEFECTIVA = @fefectiva, CUSUARIOMODIFICACION = @cusuariomodificacion, FMODIFICACION = @fmodificacion where CPARENTESCO = @cparentesco and CCLIENTE = @ccliente');
                rowsAffected = rowsAffected + update.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    deleteRelationshipsByClientUpdateQuery: async(relationships, clientData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < relationships.length; i++){
                let erase = await pool.request()
                    .input('ccliente', sql.Int, clientData.ccliente)
                    .input('cparentesco', sql.Int, relationships[i].cparentesco)
                    .query('delete from CLPARENTESCO where CPARENTESCO = @cparentesco and CCLIENTE = @ccliente');
                rowsAffected = rowsAffected + erase.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    createPenaltiesByClientUpdateQuery: async(penalties, clientData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < penalties.length; i++){
                let insert = await pool.request()
                    .input('ccliente', sql.Int, clientData.ccliente)
                    .input('cpenalizacion', sql.Int, penalties[i].cpenalizacion)
                    .input('ppenalizacion', sql.Numeric(5, 2), penalties[i].ppenalizacion)
                    .input('mpenalizacion', sql.Numeric(11, 2), penalties[i].mpenalizacion)
                    .input('fefectiva', sql.DateTime, penalties[i].fefectiva)
                    .input('cusuariocreacion', sql.Int, clientData.cusuariomodificacion)
                    .input('fcreacion', sql.DateTime, new Date())
                    .query('insert into CLPENALIZACION (CCLIENTE, CPENALIZACION, PPENALIZACION, MPENALIZACION, FEFECTIVA, CUSUARIOCREACION, FCREACION) values (@ccliente, @cpenalizacion, @ppenalizacion, @mpenalizacion, @fefectiva, @cusuariocreacion, @fcreacion)')
                rowsAffected = rowsAffected + insert.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    updatePenaltiesByClientUpdateQuery: async(penalties, clientData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < penalties.length; i++){
                let update = await pool.request()
                    .input('ccliente', sql.Int, clientData.ccliente)
                    .input('cpenalizacion', sql.Int, penalties[i].cpenalizacion)
                    .input('ppenalizacion', sql.Numeric(5, 2), penalties[i].ppenalizacion)
                    .input('mpenalizacion', sql.Numeric(11, 2), penalties[i].mpenalizacion)
                    .input('fefectiva', sql.DateTime, penalties[i].fefectiva)
                    .input('cusuariomodificacion', sql.Int, clientData.cusuariomodificacion)
                    .input('fmodificacion', sql.DateTime, new Date())
                    .query('update CLPENALIZACION set PPENALIZACION = @ppenalizacion, MPENALIZACION = @mpenalizacion, FEFECTIVA = @fefectiva, CUSUARIOMODIFICACION = @cusuariomodificacion, FMODIFICACION = @fmodificacion where CPENALIZACION = @cpenalizacion and CCLIENTE = @ccliente');
                rowsAffected = rowsAffected + update.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    deletePenaltiesByClientUpdateQuery: async(penalties, clientData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < penalties.length; i++){
                let erase = await pool.request()
                    .input('ccliente', sql.Int, clientData.ccliente)
                    .input('cpenalizacion', sql.Int, penalties[i].cpenalizacion)
                    .query('delete from CLPENALIZACION where CPENALIZACION = @cpenalizacion and CCLIENTE = @ccliente');
                rowsAffected = rowsAffected + erase.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    createProvidersByClientUpdateQuery: async(providers, clientData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < providers.length; i++){
                let insert = await pool.request()
                    .input('ccliente', sql.Int, clientData.ccliente)
                    .input('cproveedor', sql.Int, providers[i].cproveedor)
                    .input('xobservacion', sql.NVarChar, providers[i].xobservacion)
                    .input('fefectiva', sql.DateTime, providers[i].fefectiva)
                    .input('cusuariocreacion', sql.Int, clientData.cusuariomodificacion)
                    .input('fcreacion', sql.DateTime, new Date())
                    .query('insert into CLPROVEEDOREXCLUIDO (CCLIENTE, CPROVEEDOR, XOBSERVACION, FEFECTIVA, CUSUARIOCREACION, FCREACION) values (@ccliente, @cproveedor, @xobservacion, @fefectiva, @cusuariocreacion, @fcreacion)')
                rowsAffected = rowsAffected + insert.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    updateProvidersByClientUpdateQuery: async(providers, clientData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < providers.length; i++){
                let update = await pool.request()
                    .input('ccliente', sql.Int, clientData.ccliente)
                    .input('cproveedor', sql.Int, providers[i].cproveedor)
                    .input('xobservacion', sql.NVarChar, providers[i].xobservacion)
                    .input('fefectiva', sql.DateTime, providers[i].fefectiva)
                    .input('cusuariomodificacion', sql.Int, clientData.cusuariomodificacion)
                    .input('fmodificacion', sql.DateTime, new Date())
                    .query('update CLPROVEEDOREXCLUIDO set XOBSERVACION = @xobservacion, FEFECTIVA = @fefectiva, CUSUARIOMODIFICACION = @cusuariomodificacion, FMODIFICACION = @fmodificacion where CPROVEEDOR = @cproveedor and CCLIENTE = @ccliente');
                rowsAffected = rowsAffected + update.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    deleteProvidersByClientUpdateQuery: async(providers, clientData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < providers.length; i++){
                let erase = await pool.request()
                    .input('ccliente', sql.Int, clientData.ccliente)
                    .input('cproveedor', sql.Int, providers[i].cproveedor)
                    .query('delete from CLPROVEEDOREXCLUIDO where CPROVEEDOR = @cproveedor and CCLIENTE = @ccliente');
                rowsAffected = rowsAffected + erase.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    createModelsByClientUpdateQuery: async(models, clientData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < models.length; i++){
                let insert = await pool.request()
                    .input('ccliente', sql.Int, clientData.ccliente)
                    .input('cmodelo', sql.Int, models[i].cmodelo)
                    .input('cmarca', sql.Int, models[i].cmarca)
                    .input('xobservacion', sql.NVarChar, models[i].xobservacion)
                    .input('cusuariocreacion', sql.Int, clientData.cusuariomodificacion)
                    .input('fcreacion', sql.DateTime, new Date())
                    .query('insert into CLMODELOEXCLUIDO (CCLIENTE, CMODELO, CMARCA, XOBSERVACION, CUSUARIOCREACION, FCREACION) values (@ccliente, @cmodelo, @cmarca, @xobservacion, @cusuariocreacion, @fcreacion)')
                rowsAffected = rowsAffected + insert.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    updateModelsByClientUpdateQuery: async(models, clientData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < models.length; i++){
                let update = await pool.request()
                    .input('ccliente', sql.Int, clientData.ccliente)
                    .input('cmodelo', sql.Int, models[i].cmodelo)
                    .input('cmarca', sql.Int, models[i].cmarca)
                    .input('xobservacion', sql.NVarChar, models[i].xobservacion)
                    .input('cusuariomodificacion', sql.Int, clientData.cusuariomodificacion)
                    .input('fmodificacion', sql.DateTime, new Date())
                    .query('update CLMODELOEXCLUIDO set XOBSERVACION = @xobservacion, CUSUARIOMODIFICACION = @cusuariomodificacion, FMODIFICACION = @fmodificacion where CMODELO = @cmodelo and CMARCA = @cmarca and CCLIENTE = @ccliente');
                rowsAffected = rowsAffected + update.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    deleteModelsByClientUpdateQuery: async(models, clientData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < models.length; i++){
                let erase = await pool.request()
                    .input('ccliente', sql.Int, clientData.ccliente)
                    .input('cmodelo', sql.Int, models[i].cmodelo)
                    .query('delete from CLMODELOEXCLUIDO where CMODELO = @cmodelo and CCLIENTE = @ccliente');
                rowsAffected = rowsAffected + erase.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    createWorkersByClientUpdateQuery: async(workers, clientData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < workers.length; i++){
                let insert = await pool.request()
                    .input('ccliente', sql.Int, clientData.ccliente)
                    .input('xnombre', sql.NVarChar, workers[i].xnombre)
                    .input('xapellido', sql.NVarChar, workers[i].xapellido)
                    .input('ctipodocidentidad', sql.Int,  workers[i].ctipodocidentidad)
                    .input('xdocidentidad', sql.NVarChar, workers[i].xdocidentidad)
                    .input('xtelefonocelular', sql.NVarChar, workers[i].xtelefonocelular)
                    .input('xemail', sql.NVarChar, workers[i].xemail)
                    .input('xprofesion', sql.NVarChar, workers[i].xprofesion ? workers[i].xprofesion : null)
                    .input('xocupacion', sql.NVarChar, workers[i].xocupacion ? workers[i].xocupacion : null)
                    .input('xtelefonocasa', sql.NVarChar, workers[i].xtelefonocasa ? workers[i].xtelefonocasa : null)
                    .input('xfax', sql.NVarChar, workers[i].xfax ? workers[i].xfax : null)
                    .input('cparentesco', sql.Int, workers[i].cparentesco)
                    .input('cestadocivil', sql.Int, workers[i].cestadocivil)
                    .input('fnacimiento', sql.DateTime, workers[i].fnacimiento)
                    .input('xdireccion', sql.NVarChar, workers[i].xdireccion)
                    .input('cestado', sql.Int, workers[i].cestado)
                    .input('cciudad', sql.Int, workers[i].cciudad)
                    .input('cusuariocreacion', sql.Int, clientData.cusuariomodificacion)
                    .input('fcreacion', sql.DateTime, new Date())
                    .query('insert into CLTRABAJADOR (CCLIENTE, XNOMBRE, XAPELLIDO, CTIPODOCIDENTIDAD, XDOCIDENTIDAD, XTELEFONOCELULAR, XEMAIL, XPROFESION, XOCUPACION, XTELEFONOCASA, XFAX, CPARENTESCO, CESTADOCIVIL, FNACIMIENTO, XDIRECCION, CESTADO, CCIUDAD, CUSUARIOCREACION, FCREACION) values (@ccliente, @xnombre, @xapellido, @ctipodocidentidad, @xdocidentidad, @xtelefonocelular, @xemail, @xprofesion, @xocupacion, @xtelefonocasa, @xfax, @cparentesco, @cestadocivil, @fnacimiento, @xdireccion, @cestado, @cciudad, @cusuariocreacion, @fcreacion)')
                rowsAffected = rowsAffected + insert.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    updateWorkersByClientUpdateQuery: async(workers, clientData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < workers.length; i++){
                let update = await pool.request()
                    .input('ccliente', sql.Int, clientData.ccliente)
                    .input('ctrabajador', sql.Int, workers[i].ctrabajador)
                    .input('xnombre', sql.NVarChar, workers[i].xnombre)
                    .input('xapellido', sql.NVarChar, workers[i].xapellido)
                    .input('ctipodocidentidad', sql.Int,  workers[i].ctipodocidentidad)
                    .input('xdocidentidad', sql.NVarChar, workers[i].xdocidentidad)
                    .input('xtelefonocelular', sql.NVarChar, workers[i].xtelefonocelular)
                    .input('xemail', sql.NVarChar, workers[i].xemail)
                    .input('xprofesion', sql.NVarChar, workers[i].xprofesion ? workers[i].xprofesion : null)
                    .input('xocupacion', sql.NVarChar, workers[i].xocupacion ? workers[i].xocupacion : null)
                    .input('xtelefonocasa', sql.NVarChar, workers[i].xtelefonocasa ? workers[i].xtelefonocasa : null)
                    .input('xfax', sql.NVarChar, workers[i].xfax ? workers[i].xfax : null)
                    .input('cparentesco', sql.Int, workers[i].cparentesco)
                    .input('cestadocivil', sql.Int, workers[i].cestadocivil)
                    .input('fnacimiento', sql.DateTime, workers[i].fnacimiento)
                    .input('xdireccion', sql.NVarChar, workers[i].xdireccion)
                    .input('cestado', sql.Int, workers[i].cestado)
                    .input('cciudad', sql.Int, workers[i].cciudad)
                    .input('cusuariomodificacion', sql.Int, clientData.cusuariomodificacion)
                    .input('fmodificacion', sql.DateTime, new Date())
                    .query('update CLTRABAJADOR set XNOMBRE = @xnombre, XAPELLIDO = @xapellido, CTIPODOCIDENTIDAD = @ctipodocidentidad, XDOCIDENTIDAD = @xdocidentidad, XTELEFONOCELULAR = @xtelefonocelular, XEMAIL = @xemail, XPROFESION = @xprofesion, XOCUPACION = @xocupacion, XTELEFONOCASA = @xtelefonocasa, XFAX = @xfax, CPARENTESCO = @cparentesco, CESTADOCIVIL = @cestadocivil, FNACIMIENTO = @fnacimiento, XDIRECCION = @xdireccion, CESTADO = @cestado, CCIUDAD = @cciudad, CUSUARIOMODIFICACION = @cusuariomodificacion, FMODIFICACION = @fmodificacion where CTRABAJADOR = @ctrabajador and CCLIENTE = @ccliente');
                rowsAffected = rowsAffected + update.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    deleteWorkersByClientUpdateQuery: async(workers, clientData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < workers.length; i++){
                let erase = await pool.request()
                    .input('ccliente', sql.Int, clientData.ccliente)
                    .input('ctrabajador', sql.Int, workers[i].ctrabajador)
                    .query('delete from CLTRABAJADOR where CTRABAJADOR = @ctrabajador and CCLIENTE = @ccliente');
                rowsAffected = rowsAffected + erase.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    createDocumentsByClientUpdateQuery: async(documents, clientData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < documents.length; i++){
                let insert = await pool.request()
                    .input('ccliente', sql.Int, clientData.ccliente)
                    .input('cdocumento', sql.Int, documents[i].cdocumento)
                    .input('xrutaarchivo', sql.NVarChar, documents[i].xrutaarchivo)
                    .input('cusuariocreacion', sql.Int, clientData.cusuariomodificacion)
                    .input('fcreacion', sql.DateTime, new Date())
                    .query('insert into CLDOCUMENTO (CCLIENTE, CDOCUMENTO, XRUTAARCHIVO, CUSUARIOCREACION, FCREACION) values (@ccliente, @cdocumento, @xrutaarchivo, @cusuariocreacion, @fcreacion)')
                rowsAffected = rowsAffected + insert.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    updateDocumentsByClientUpdateQuery: async(documents, clientData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < documents.length; i++){
                let update = await pool.request()
                    .input('ccliente', sql.Int, clientData.ccliente)
                    .input('cdocumento', sql.Int, documents[i].cdocumento)
                    .input('xrutaarchivo', sql.NVarChar, documents[i].xrutaarchivo)
                    .input('cusuariomodificacion', sql.Int, clientData.cusuariomodificacion)
                    .input('fmodificacion', sql.DateTime, new Date())
                    .query('update CLDOCUMENTO set XRUTAARCHIVO = @xrutaarchivo, CUSUARIOMODIFICACION = @cusuariomodificacion, FMODIFICACION = @fmodificacion where CDOCUMENTO = @cdocumento and CCLIENTE = @ccliente');
                rowsAffected = rowsAffected + update.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    deleteDocumentsByClientUpdateQuery: async(documents, clientData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < documents.length; i++){
                let erase = await pool.request()
                    .input('ccliente', sql.Int, clientData.ccliente)
                    .input('cdocumento', sql.Int, documents[i].cdocumento)
                    .query('delete from CLDOCUMENTO where CDOCUMENTO = @cdocumento and CCLIENTE = @ccliente');
                rowsAffected = rowsAffected + erase.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    createPlansByClientUpdateQuery: async(plans, clientData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < plans.length; i++){
                let insert = await pool.request()
                    .input('ccliente', sql.Int, clientData.ccliente)
                    .input('casociado', sql.Int, plans[i].casociado)
                    .input('ctipoplan', sql.Int, plans[i].ctipoplan)
                    .input('cplan', sql.Int, plans[i].cplan)
                    .input('fdesde', sql.DateTime, plans[i].fdesde)
                    .input('fhasta', sql.DateTime, plans[i].fhasta)
                    .input('cusuariocreacion', sql.Int, clientData.cusuariomodificacion)
                    .input('fcreacion', sql.DateTime, new Date())
                    .query('insert into CLPLAN (CCLIENTE, CASOCIADO, CTIPOPLAN, CPLAN, FDESDE, FHASTA, CUSUARIOCREACION, FCREACION) values (@ccliente, @casociado, @ctipoplan, @cplan, @fdesde, @fhasta, @cusuariocreacion, @fcreacion)')
                rowsAffected = rowsAffected + insert.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    updatePlansByClientUpdateQuery: async(plans, clientData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < plans.length; i++){
                let update = await pool.request()
                    .input('ccliente', sql.Int, clientData.ccliente)
                    .input('cplancliente', sql.Int, plans[i].cplancliente)
                    .input('casociado', sql.Int, plans[i].casociado)
                    .input('ctipoplan', sql.Int, plans[i].ctipoplan)
                    .input('cplan', sql.Int, plans[i].cplan)
                    .input('fdesde', sql.DateTime, plans[i].fdesde)
                    .input('fhasta', sql.DateTime, plans[i].fhasta)
                    .input('cusuariomodificacion', sql.Int, clientData.cusuariomodificacion)
                    .input('fmodificacion', sql.DateTime, new Date())
                    .query('update CLPLAN set  CPLAN = @cplan, CASOCIADO = @casociado, CTIPOPLAN = @ctipoplan, FDESDE = @fdesde, FHASTA = @fhasta, CUSUARIOMODIFICACION = @cusuariomodificacion, FMODIFICACION = @fmodificacion where CPLANCLIENTE = @cplancliente and CCLIENTE = @ccliente');
                rowsAffected = rowsAffected + update.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    deletePlansByClientUpdateQuery: async(plans, clientData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < plans.length; i++){
                let erase = await pool.request()
                    .input('ccliente', sql.Int, clientData.ccliente)
                    .input('cplancliente', sql.Int, plans[i].cplancliente)
                    .query('delete from CLPLAN where CPLANCLIENTE = @cplancliente and CCLIENTE = @ccliente');
                rowsAffected = rowsAffected + erase.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    createGroupersByClientUpdateQuery: async(groupers, clientData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < groupers.length; i++){
                let insert = await pool.request()
                    .input('ccliente', sql.Int, clientData.ccliente)
                    .input('xcontratoalternativo', sql.NVarChar, groupers[i].xcontratoalternativo)
                    .input('xnombre', sql.NVarChar, groupers[i].xnombre)
                    .input('xrazonsocial', sql.NVarChar, groupers[i].xrazonsocial)
                    .input('cestado', sql.Int, groupers[i].cestado)
                    .input('cciudad', sql.Int, groupers[i].cciudad)
                    .input('xdireccionfiscal', sql.NVarChar, groupers[i].xdireccionfiscal)
                    .input('ctipodocidentidad', sql.Int, groupers[i].ctipodocidentidad)
                    .input('xdocidentidad', sql.NVarChar, groupers[i].xdocidentidad)
                    .input('bfacturar', sql.Bit, groupers[i].bfacturar)
                    .input('bcontribuyente', sql.Bit, groupers[i].bcontribuyente)
                    .input('bimpuesto', sql.Bit, groupers[i].bimpuesto)
                    .input('xtelefono', sql.NVarChar, groupers[i].xtelefono)
                    .input('xfax', sql.NVarChar, groupers[i].xfax ? groupers[i].xfax : null)
                    .input('xemail', sql.NVarChar, groupers[i].xemail)
                    .input('xrutaimagen', sql.NVarChar, groupers[i].xrutaimagen ? groupers[i].xrutaimagen : null)
                    .input('bactivo', sql.Bit, groupers[i].bactivo)
                    .input('cusuariocreacion', sql.Int, clientData.cusuariomodificacion)
                    .input('fcreacion', sql.DateTime, new Date())
                    .query('insert into CLAGRUPADOR (CCLIENTE, XCONTRATOALTERNATIVO, XNOMBRE, XRAZONSOCIAL, CESTADO, CCIUDAD, XDIRECCIONFISCAL, CTIPODOCIDENTIDAD, XDOCIDENTIDAD, BFACTURAR, BCONTRIBUYENTE, BIMPUESTO, XTELEFONO, XFAX, XEMAIL, XRUTAIMAGEN, BACTIVO, CUSUARIOCREACION, FCREACION) output inserted.CAGRUPADOR values (@ccliente, @xcontratoalternativo, @xnombre, @xrazonsocial, @cestado, @cciudad, @xdireccionfiscal, @ctipodocidentidad, @xdocidentidad, @bfacturar, @bcontribuyente, @bimpuesto, @xtelefono, @xfax, @xemail, @xrutaimagen, @bactivo, @cusuariocreacion, @fcreacion)')
                rowsAffected = rowsAffected + insert.rowsAffected;
                if(insert.rowsAffected > 0 && groupers[i].banks){
                    for(let j = 0; j < groupers[i].banks.length; j++){
                        let subInsert = await pool.request()
                            .input('cagrupador', sql.Int, insert.recordset[0].CAGRUPADOR)
                            .input('cbanco', sql.Int, groupers[i].banks[j].cbanco)
                            .input('ctipocuentabancaria', sql.Int, groupers[i].banks[j].ctipocuentabancaria)
                            .input('xnumerocuenta', sql.NVarChar, groupers[i].banks[j].xnumerocuenta)
                            .input('xcontrato', sql.NVarChar, groupers[i].banks[j].xcontrato)
                            .input('bprincipal', sql.Bit, groupers[i].banks[j].bprincipal)
                            .input('cusuariocreacion', sql.Int, clientData.cusuariomodificacion)
                            .input('fcreacion', sql.DateTime, new Date())
                            .query('insert into CLBANCOAGRUPADOR (CAGRUPADOR, CBANCO, CTIPOCUENTABANCARIA, XNUMEROCUENTA, XCONTRATO, BPRINCIPAL, CUSUARIOCREACION, FCREACION) values (@cagrupador, @cbanco, @ctipocuentabancaria, @xnumerocuenta, @xcontrato, @bprincipal, @cusuariocreacion, @fcreacion)')
                    }
                }
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    updateGroupersByClientUpdateQuery: async(groupers, clientData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < groupers.length; i++){
                let update = await pool.request()
                    .input('ccliente', sql.Int, clientData.ccliente)
                    .input('cagrupador', sql.Int, groupers[i].cagrupador)
                    .input('xcontratoalternativo', sql.NVarChar, groupers[i].xcontratoalternativo)
                    .input('xnombre', sql.NVarChar, groupers[i].xnombre)
                    .input('xrazonsocial', sql.NVarChar, groupers[i].xrazonsocial)
                    .input('cestado', sql.Int, groupers[i].cestado)
                    .input('cciudad', sql.Int, groupers[i].cciudad)
                    .input('xdireccionfiscal', sql.NVarChar, groupers[i].xdireccionfiscal)
                    .input('ctipodocidentidad', sql.Int, groupers[i].ctipodocidentidad)
                    .input('xdocidentidad', sql.NVarChar, groupers[i].xdocidentidad)
                    .input('bfacturar', sql.Bit, groupers[i].bfacturar)
                    .input('bcontribuyente', sql.Bit, groupers[i].bcontribuyente)
                    .input('bimpuesto', sql.Bit, groupers[i].bimpuesto)
                    .input('xtelefono', sql.NVarChar, groupers[i].xtelefono)
                    .input('xfax', sql.NVarChar, groupers[i].xfax ? groupers[i].xfax : null)
                    .input('xemail', sql.NVarChar, groupers[i].xemail)
                    .input('xrutaimagen', sql.NVarChar, groupers[i].xrutaimagen ? groupers[i].xrutaimagen : null)
                    .input('bactivo', sql.Bit, groupers[i].bactivo)
                    .input('cusuariomodificacion', sql.Int, clientData.cusuariomodificacion)
                    .input('fmodificacion', sql.DateTime, new Date())
                    .query('update CLAGRUPADOR set XCONTRATOALTERNATIVO = @xcontratoalternativo, XNOMBRE = @xnombre, XRAZONSOCIAL = @xrazonsocial, CESTADO = @cestado, CCIUDAD = @cciudad, XDIRECCIONFISCAL = @xdireccionfiscal, CTIPODOCIDENTIDAD = @ctipodocidentidad, XDOCIDENTIDAD = @xdocidentidad, BFACTURAR = @bfacturar, BCONTRIBUYENTE = @bcontribuyente, BIMPUESTO = @bimpuesto, XTELEFONO = @xtelefono, XFAX = @xfax, XEMAIL = @xemail, XRUTAIMAGEN = @xrutaimagen, BACTIVO = @bactivo, CUSUARIOMODIFICACION = @cusuariomodificacion, FMODIFICACION = @fmodificacion where CAGRUPADOR = @cagrupador and CCLIENTE = @ccliente');
                rowsAffected = rowsAffected + update.rowsAffected;
                if(groupers[i].banks){
                    if(update.rowsAffected > 0 && groupers[i].banks.create){
                        for(let j = 0; j < groupers[i].banks.create.length; j++){
                            let subInsert = await pool.request()
                                .input('cagrupador', sql.Int, groupers[i].cagrupador)
                                .input('cbanco', sql.Int, groupers[i].banks.create[j].cbanco)
                                .input('ctipocuentabancaria', sql.Int, groupers[i].banks.create[j].ctipocuentabancaria)
                                .input('xnumerocuenta', sql.NVarChar, groupers[i].banks.create[j].xnumerocuenta)
                                .input('xcontrato', sql.NVarChar, groupers[i].banks.create[j].xcontrato)
                                .input('bprincipal', sql.Bit, groupers[i].banks.create[j].bprincipal)
                                .input('cusuariocreacion', sql.Int, clientData.cusuariomodificacion)
                                .input('fcreacion', sql.DateTime, new Date())
                                .query('insert into CLBANCOAGRUPADOR (CAGRUPADOR, CBANCO, CTIPOCUENTABANCARIA, XNUMEROCUENTA, XCONTRATO, BPRINCIPAL, CUSUARIOCREACION, FCREACION) values (@cagrupador, @cbanco, @ctipocuentabancaria, @xnumerocuenta, @xcontrato, @bprincipal, @cusuariocreacion, @fcreacion)')
                        }
                    }
                    if(update.rowsAffected > 0 && groupers[i].banks.update){
                        for(let j = 0; j < groupers[i].banks.update.length; j++){
                            let subUpdate = await pool.request()
                                .input('cagrupador', sql.Int, groupers[i].cagrupador)
                                .input('cbanco', sql.Int, groupers[i].banks.update[j].cbanco)
                                .input('ctipocuentabancaria', sql.Int, groupers[i].banks.update[j].ctipocuentabancaria)
                                .input('xnumerocuenta', sql.NVarChar, groupers[i].banks.update[j].xnumerocuenta)
                                .input('xcontrato', sql.NVarChar, groupers[i].banks.update[j].xcontrato)
                                .input('bprincipal', sql.Bit, groupers[i].banks.update[j].bprincipal)
                                .input('cusuariomodificacion', sql.Int, clientData.cusuariomodificacion)
                                .input('fmodificacion', sql.DateTime, new Date())
                                .query('update CLBANCOAGRUPADOR set CTIPOCUENTABANCARIA = @ctipocuentabancaria, XNUMEROCUENTA = @xnumerocuenta, XCONTRATO = @xcontrato, BPRINCIPAL = @bprincipal, CUSUARIOMODIFICACION = @cusuariomodificacion, FMODIFICACION = @fmodificacion where CBANCO = @cbanco and CAGRUPADOR = @cagrupador');
                        }
                    }
                    if(update.rowsAffected > 0 && groupers[i].banks.delete){
                        for(let j = 0; j < groupers[i].banks.delete.length; j++){
                            let subDelete = await pool.request()
                                .input('cagrupador', sql.Int, groupers[i].cagrupador)
                                .input('cbanco', sql.Int, groupers[i].banks.delete[j].cbanco)
                                .query('delete from CLBANCOAGRUPADOR where CBANCO = @cbanco and CAGRUPADOR = @cagrupador');
                        }
                    }
                }
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    deleteGroupersByClientUpdateQuery: async(groupers, clientData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < groupers.length; i++){
                let suberase = await pool.request()
                    .input('cagrupador', sql.Int, groupers[i].cagrupador)
                    .query('delete from CLBANCOAGRUPADOR where CAGRUPADOR = @cagrupador');
                let erase = await pool.request()
                    .input('ccliente', sql.Int, clientData.ccliente)
                    .input('cagrupador', sql.Int, groupers[i].cagrupador)
                    .query('delete from CLAGRUPADOR where CAGRUPADOR = @cagrupador and CCLIENTE = @ccliente');
                rowsAffected = rowsAffected + erase.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    searchCollectionOrderFleetContractQuery: async(searchData) => {
        try{
            let query = `select * from VWBUSCARSOLICITUDCOBROCONTRATOFLOTADATA where CPAIS = @cpais and CCOMPANIA = @ccompania${ searchData.ccliente ? " and CCLIENTE = @ccliente" : '' }${ searchData.ifacturacion ? " and IFACTURACION = @ifacturacion" : '' }`;
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cpais', sql.Numeric(4, 0), searchData.cpais ? searchData.cpais : 1)
                .input('ccompania', sql.Int, searchData.ccompania ? searchData.ccompania : 1)
                .input('ccliente', sql.Int, searchData.ccliente ? searchData.ccliente : 1)
                .input('ifacturacion', sql.NChar, searchData.ifacturacion ? searchData.ifacturacion : '')
                .query(query);
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    getCollectionOrderFleetContractDataQuery: async(collectionOrderFleetContractData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cpais', sql.Numeric(4, 0), collectionOrderFleetContractData.cpais)
                .input('ccompania', sql.Int, collectionOrderFleetContractData.ccompania)
                .input('csolicitudcobrocontratoflota', sql.Int, collectionOrderFleetContractData.csolicitudcobrocontratoflota)
                .query('select * from ADSOLICITUDCOBROCONTRATOFLOTA where CSOLICITUDCOBROCONTRATOFLOTA = @csolicitudcobrocontratoflota and CPAIS = @cpais and CCOMPANIA = @ccompania');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    getCollectionOrderFleetContractSuscriptionsDataQuery: async(csolicitudcobrocontratoflota) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('csolicitudcobrocontratoflota', sql.Int, csolicitudcobrocontratoflota)
                .query('select * from VWBUSCARSUSCRIPCIONXSOLICITUDCOBROCONTRATOFLOTADATA where CSOLICITUDCOBROCONTRATOFLOTA = @csolicitudcobrocontratoflota');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    getCollectionOrderFleetContractPaymentsDataQuery: async(csolicitudcobrocontratoflota) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('csolicitudcobrocontratoflota', sql.Int, csolicitudcobrocontratoflota)
                .query('select * from ADPAGOSOLICITUDCOBROCONTRATOFLOTA where CSOLICITUDCOBROCONTRATOFLOTA = @csolicitudcobrocontratoflota');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    updateCollectionOrderFleetContractQuery: async(collectionOrderFleetContractData) => {
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()
                .input('cpais', sql.Numeric(4, 0), collectionOrderFleetContractData.cpais)
                .input('ccompania', sql.Int, collectionOrderFleetContractData.ccompania)
                .input('csolicitudcobrocontratoflota', sql.Int, collectionOrderFleetContractData.csolicitudcobrocontratoflota)
                .input('cestatusgeneral', sql.Int, collectionOrderFleetContractData.cestatusgeneral)
                .input('bactivo', sql.Bit, collectionOrderFleetContractData.bactivo)
                .input('cusuariomodificacion', sql.Int, collectionOrderFleetContractData.cusuariomodificacion)
                .input('fmodificacion', sql.DateTime, new Date())
                .query('update ADSOLICITUDCOBROCONTRATOFLOTA set CESTATUSGENERAL = @cestatusgeneral, BACTIVO = @bactivo, CUSUARIOMODIFICACION = @cusuariomodificacion, FMODIFICACION = @fmodificacion where CSOLICITUDCOBROCONTRATOFLOTA = @csolicitudcobrocontratoflota and CPAIS = @cpais and CCOMPANIA = @ccompania');
            //sql.close();
            return { result: result };
        }catch(err){
            return { error: err.message };
        }
    },
    createPaymentsByCollectionOrderFleetContractUpdateQuery: async(payments, collectionOrderFleetContractData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < payments.length; i++){
                let insert = await pool.request()
                    .input('csolicitudcobrocontratoflota', sql.Int, collectionOrderFleetContractData.csolicitudcobrocontratoflota)
                    .input('mpago', sql.Numeric(11, 2), payments[i].mpago)
                    .input('bpagado', sql.Bit, payments[i].bpagado)
                    .input('cusuariocreacion', sql.Int, collectionOrderFleetContractData.cusuariomodificacion)
                    .input('fcreacion', sql.DateTime, new Date())
                    .query('insert into ADPAGOSOLICITUDCOBROCONTRATOFLOTA (CSOLICITUDCOBROCONTRATOFLOTA, MPAGO, BPAGADO, CUSUARIOCREACION, FCREACION) values (@csolicitudcobrocontratoflota, @mpago, @bpagado, @cusuariocreacion, @fcreacion)')
                rowsAffected = rowsAffected + insert.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    updatePaymentsByCollectionOrderFleetContractUpdateQuery: async(payments, collectionOrderFleetContractData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < payments.length; i++){
                let update = await pool.request()
                    .input('csolicitudcobrocontratoflota', sql.Int, collectionOrderFleetContractData.csolicitudcobrocontratoflota)
                    .input('cpago', sql.Int, payments[i].cpago)
                    .input('mpago', sql.Numeric(11, 2), payments[i].mpago)
                    .input('bpagado', sql.Bit, payments[i].bpagado)
                    .input('cusuariomodificacion', sql.Int, collectionOrderFleetContractData.cusuariomodificacion)
                    .input('fmodificacion', sql.DateTime, new Date())
                    .query('update ADPAGOSOLICITUDCOBROCONTRATOFLOTA set MPAGO = @mpago, BPAGADO = @bpagado, CUSUARIOMODIFICACION = @cusuariomodificacion, FMODIFICACION = @fmodificacion where CPAGO = @cpago and CSOLICITUDCOBROCONTRATOFLOTA = @csolicitudcobrocontratoflota');
                rowsAffected = rowsAffected + update.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    },
    deletePaymentsByCollectionOrderFleetContractUpdateQuery: async(payments, collectionOrderFleetContractData) => {
        try{
            let rowsAffected = 0;
            let pool = await sql.connect(config);
            for(let i = 0; i < payments.length; i++){
                let erase = await pool.request()
                    .input('csolicitudcobrocontratoflota', sql.Int, collectionOrderFleetContractData.csolicitudcobrocontratoflota)
                    .input('cpago', sql.Int, payments[i].cpago)
                    .query('delete from ADPAGOSOLICITUDCOBROCONTRATOFLOTA where CPAGO = @cpago and CSOLICITUDCOBROCONTRATOFLOTA = @csolicitudcobrocontratoflota');
                rowsAffected = rowsAffected + erase.rowsAffected;
            }
            //sql.close();
            return { result: { rowsAffected: rowsAffected } };
        }
        catch(err){
            return { error: err.message };
        }
    }
}