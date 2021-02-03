const tuckService = {
    getAllSymptoms(knex) {
      return knex.select('*').from('symptoms');
    },
    getSymptomById(knex, id){
        return knex.from('symptoms').select('*').where('id', id).first()
    },
    insertSymptom(knex, newSymptom){
        return knex
        .insert(newSymptom)
        .into('symptoms')
        .returning('*')
        .then(rows =>{
            return rows[0];
        });
    },
    deleteSymptom(knex, id){
        return knex('symptoms')
        .where({ id })
        .delete()
    },
    updateSymptom(knex, id, updatedSymptom){
        return knex('symptoms')
        .where({id})
        .update(updatedSymptom)
    }
};
module.exports = tuckService