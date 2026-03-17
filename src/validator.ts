export function validateQuery(query: string): {valid: boolean, reason?: string} {
    // check if the query creation was successful
    if(query === 'CANNOT_GENERATE'){
        return {valid: false, reason: 'Model cannot generate a query for that request.'};
    }

    const normalized = query.trim().toUpperCase();

    // console.log(normalized.replace("\n", ' ').split(' '));
    
    // check if query starts with SELECT keyword
    if(!normalized.startsWith('SELECT')){
        return {valid: false, reason: 'Only SELECT queries are allowed.'};
    }

    const dangerousKeywords = [
        'INSERT', 'UPDATE', 'DELETE', 'DROP', 'ALTER', 'CREATE', 'TRUNCATE', 'COMMIT', 'ROLLBACK', 'EXEC'
    ];

    // check if query cotains any of the dangerous keywords
    for(const keyword of dangerousKeywords){
        if(normalized.includes(keyword)){
            console.error(`Wrong query -> ${ normalized }`);
            return {valid: false, reason: `Query cannot contain ${keyword} keyword.`}
        }
    }

    return {valid: true};
}