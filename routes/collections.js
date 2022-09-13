const router = require('express').Router();
const helper = require('../src/helper');
const bd = require('../src/bd');

router.route('/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchCollections(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            console.log(err.message)
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchCollections' } });
        });
    }
});

const operationSearchCollections = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        crecaudo: requestBody.crecaudo ? requestBody.crecaudo.toUpperCase() : undefined,
        ctiponotificacion: requestBody.ctiponotificacion ? requestBody.ctiponotificacion.toUpperCase() : undefined,
        ccompania: requestBody.ccompania
    }
    let searchCollections = await bd.searchCollectionsQuery(searchData).then((res) => res);
    if(searchCollections.error){ return { status: false, code: 500, message: searchCollections.error }; }
    if(searchCollections.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchCollections.result.recordset.length; i++){
            jsonList.push({
                crecaudo: searchCollections.result.recordset[i].CRECAUDO,
                xrecaudo: searchCollections.result.recordset[i].XRECAUDO
            });
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'Coin not found.' }; }
}

router.route('/create').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationCreateCollections(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operatoperationCreateCollectionsionCreate' } });
        });
    }
});

const operationCreateCollections = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let collectionsData = {
        xrecaudo: requestBody.xrecaudo,
        ctiponotificacion: requestBody.ctiponotificacion,
        bactivo: requestBody.bactivo,
        ccompania: requestBody.ccompania
    };
    let createCollections = await bd.createCollectionsQuery(collectionsData).then((res) => res);
    if(createCollections.error){ return { status: false, code: 500, message: createCollections.error }; }
    if(createCollections.result.rowsAffected > 0){ return { status: true, crecaudo: createCollections.result.recordset[0].CRECAUDO }; }
    else{ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createCollections' };  }
    
}

router.route('/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationDetailCollections(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            console.log(err.message)
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailCollections' } });
        });
    }
});

const operationDetailCollections = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        crecaudo: requestBody.crecaudo,
        ccompania: requestBody.ccompania
    }
    let detailCollections = await bd.detailCollectionsQuery(searchData).then((res) => res);
    if(detailCollections.error){ return { status: false, code: 500, message: detailCollections.error }; }
    if(detailCollections.result.rowsAffected > 0){
        return {
            status: true,
            crecaudo: detailCollections.result.recordset[0].CRECAUDO,
            xrecaudo: detailCollections.result.recordset[0].XRECAUDO,
            ctiponotificacion: detailCollections.result.recordset[0].CTIPONOTIFICACION,
            xtiponotificacion: detailCollections.result.recordset[0].XTIPONOTIFICACION,
            bactivo: detailCollections.result.recordset[0].BACTIVO
        }
    }else{ return { status: false, code: 404, message: 'Coin not found.' }; }
}

router.route('/search-collections').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationCollections(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCollections' } });
        });
    }
});

const operationCollections = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        crecaudo: requestBody.crecaudo,
        ccompania: requestBody.ccompania
    }
    let Collections = await bd.collectionsQuery(searchData).then((res) => res);
    if(Collections.error){ return { status: false, code: 500, message: Collections.error }; }
    if(Collections.result.rowsAffected > 0){
        return {
            status: true,
            crecaudo: Collections.result.recordset[0].CRECAUDO,
            xrecaudo: Collections.result.recordset[0].XRECAUDO,
            bactivo: Collections.result.recordset[0].BACTIVO
        }
    }else{ return { status: false, code: 404, message: 'Coin not found.' }; }
}

router.route('/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationUpdateCollections(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdateCollections' } });
        });
    }
});

const operationUpdateCollections = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let collectionsData = {
        ccompania: requestBody.ccompania,
        crecaudo: requestBody.crecaudo,
        xrecaudo: requestBody.xrecaudo,
        bactivo: requestBody.bactivo
    }
    if(requestBody.collection){
        let collectionUpdateList = [];
        if(requestBody.collection.update && requestBody.collection.update.length > 0){
            for(let i = 0; i < requestBody.collection.update.length; i++){
                collectionUpdateList.push({
                    crecaudo: requestBody.collection.update[i].crecaudo,
                    xrecaudo: requestBody.collection.update[i].xrecaudo,
                    bactivo: requestBody.collection.update[i].bactivo
                })
            }
            let updateCollectionsByCollectionsUpdate = await bd.updateCollectionsByCollectionsUpdateQuery(collectionUpdateList, collectionsData).then((res) => res);
            if(updateCollectionsByCollectionsUpdate.error){ return { status: false, code: 500, message: updateCollectionsByCollectionsUpdate.error }; }
            if(updateCollectionsByCollectionsUpdate.result.rowsAffected < 0){ return { status: false, code: 404, message: 'Note not found.' }; }
        }
    }
    if(requestBody.document){
        let documentCreateList = [];
        if(requestBody.document.create && requestBody.document.create.length > 0){
            for(let i = 0; i < requestBody.document.create.length; i++){
                documentCreateList.push({
                    crecaudo: requestBody.document.create[i].crecaudo,
                    xdocumentos: requestBody.document.create[i].xdocumentos,
                    ccompania: requestBody.document.create[i].ccompania,
                    bactivo: requestBody.document.create[i].bactivo
                })
            }

            let createDocumentsByCollectionsUpdate = await bd.createDocumentsByCollectionsUpdateQuery(documentCreateList, collectionsData).then((res) => res);
            if(createDocumentsByCollectionsUpdate.error){ return { status: false, code: 500, message: createDocumentsByCollectionsUpdate.error }; }
            if(createDocumentsByCollectionsUpdate.result.rowsAffected < 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createDocumentsByCollectionsUpdate' }; }
        } 

        let documentUpdateList = [];
        if(requestBody.document.update && requestBody.document.update.length > 0){
            for(let i = 0; i < requestBody.document.update.length; i++){
                documentUpdateList.push({
                    cdocumento: requestBody.document.update[i].cdocumento,
                    xdocumentos: requestBody.document.update[i].xdocumentos,
                    crecaudo: requestBody.document.update[i].crecaudo,
                    bactivo: requestBody.document.update[i].bactivo
                })
                console.log(documentUpdateList)
            }
            let updateDocumentByCollectionsUpdate = await bd.updateDocumentByCollectionsUpdateQuery(documentUpdateList).then((res) => res);
            if(updateDocumentByCollectionsUpdate.error){ return { status: false, code: 500, message: updateDocumentByCollectionsUpdate.error }; }
            if(updateDocumentByCollectionsUpdate.result.rowsAffected < 0){ return { status: false, code: 404, message: 'Note not found.' }; }
        }
    }
    return { status: true, crecaudo: collectionsData.crecaudo};
}

router.route('/documents-detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationDetailDocuments(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            console.log(err.message)
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailDocuments' } });
        });
    }
});

const operationDetailDocuments = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        crecaudo: requestBody.crecaudo,
        ccompania: requestBody.ccompania
    }
    let detailDocuments = await bd.detailDocumentsQuery(searchData).then((res) => res);
    if(detailDocuments.error){ return { status: false, code: 500, message: detailDocuments.error }; }
    if(detailDocuments.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < detailDocuments.result.recordset.length; i++){
            jsonList.push({
                crecaudo: detailDocuments.result.recordset[i].CRECAUDO,
                cdocumento: detailDocuments.result.recordset[i].CDOCUMENTO,
                xdocumentos: detailDocuments.result.recordset[i].XDOCUMENTOS,
                bactivo: detailDocuments.result.recordset[i].BACTIVO
            });
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'Coin not found.' }; }
}

router.route('/search-documents').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationSearchDocuments(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchDocuments' } });
        });
    }
});

const operationSearchDocuments = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        cdocumento: requestBody.cdocumento,
        ccompania: requestBody.ccompania
    }
    let searchDocuments = await bd.searchDocumentsQuery(searchData).then((res) => res);
    if(searchDocuments.error){ return { status: false, code: 500, message: searchDocuments.error }; }
    if(searchDocuments.result.rowsAffected > 0){
        return {
            status: true,
            cdocumento: searchDocuments.result.recordset[0].CDOCUMENTO,
            xdocumentos: searchDocuments.result.recordset[0].XDOCUMENTOS,
            xrecaudo: searchDocuments.result.recordset[0].XRECAUDO,
            bactivo: searchDocuments.result.recordset[0].BACTIVO
        }
    }else{ return { status: false, code: 404, message: 'Coin not found.' }; }
}

module.exports = router;