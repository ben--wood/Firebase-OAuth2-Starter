(function () {
    'use strict';

    angular
      .module('app')
      .factory('noteService', noteService);

    noteService.$inject = ['$log', '$q', 'databaseService'];

    function noteService($log, $q, databaseService) {
    
      var service = {
        add: add,
        edit: edit,
        getAll: getAll,
        getById: getById,
        remove: remove
      };

      return service;

      ////////////


      /**
      * Adds a new note to the db.
      * @param {string} - the text of the note to update
      * @return {!angular.$q.Promise}
      */
      function add(text) {         
        var deferred = $q.defer();        
        
        databaseService.connect().then(function() {
            
          var row = databaseService.noteTable_.createRow({
            'id': guid(),
            'text': text
          });

          // Insert docs: https://github.com/google/lovefield/blob/master/docs/spec/04_query.md#42-insert-query-builder
          databaseService.db_.insertOrReplace()
            .into(databaseService.noteTable_)
            .values([row])
            .exec()
            .then(
              function() {
                deferred.resolve();
              });	
        });
                
        return deferred.promise; 
      }
      
      
      /**
      * Updates a note in the db.
      * @param {guid} - the id of the note to update
      * @param {string} - the text of the note to update
      * @return {!angular.$q.Promise}
      */
      function edit(id, text) {         
        var deferred = $q.defer();        
        
        databaseService.connect().then(function() {

          // Update docs: https://github.com/google/lovefield/blob/master/docs/spec/04_query.md#43-update-query-builder
          databaseService.db_.update(databaseService.noteTable_)
            .set(databaseService.noteTable_.text, text)
            .where(databaseService.noteTable_.id.eq(id))
            .exec()
            .then(
              function() {
                deferred.resolve();
              });	
        });
                
        return deferred.promise; 
      }

     
      /**
      * Gets all notes from the  db.
      * @return {!angular.$q.Promise.<!Array<!Object>>}
      */
      function getAll() {         
        var deferred = $q.defer();        
        
        databaseService.connect().then(function() {
          
          // TODO: Observe the select query to save having to explicitly call getNotes() after an INSERT/UPDATE or DELETE docs: https://github.com/google/lovefield/blob/master/docs/spec/04_query.md#46-observers
          // db.observe(selectQuery, handler);
          
          // SELECT docs: https://github.com/google/lovefield/blob/master/docs/spec/04_query.md#418-retrieval-of-query-results 
          databaseService.db_.select()
            .from(databaseService.noteTable_)
            .exec()
            .then(
            function(rows) {
              deferred.resolve(rows);
            });
        });
                
        return deferred.promise; 
      }
      
      
      /**
      * Gets a single note from the db.
      * @param {guid} - the id of the note to retrieve
      * @return {!angular.$q.Promise.<!Object>}
      */
      function getById(id) {         
        var deferred = $q.defer();        
        
        databaseService.connect().then(function() {
          
          databaseService.db_.select()
            .from(databaseService.noteTable_)
            .where(databaseService.noteTable_.id.eq(id))
            .exec()
            .then(
              function(results) {
                if (angular.isDefined(results) && results.length === 1) {
                  deferred.resolve(results[0]);                  
                } else {
                  $log.error('Note not found with id of: ' + id, results);
                  deferred.reject();
                }                   
              });
        });
                
        return deferred.promise; 
      }
      
      
      /**
      * Deletes a note from the db.
      * @param {guid} - the id of the note to retrieve
      * @return {!angular.$q.Promise} - promise that is resolved once the row has been deleted
      */
      function remove(id) {         
        var deferred = $q.defer();        
        
        databaseService.connect().then(function() {
          
          // DELETE docs: https://github.com/google/lovefield/blob/master/docs/spec/04_query.md#44-delete-query-builder
          databaseService.db_.delete()
            .from(databaseService.noteTable_)
            .where(databaseService.noteTable_.id.eq(id))
            .exec()
            .then(
                function() {      
                    deferred.resolve();
                });
        });
                
        return deferred.promise; 
      }
      
    
      /**
      * Creates a guid.
      * @return {guid}  
      * @private   
      * copy/pasted from http://stackoverflow.com/a/105074/2652910 - thank you
      */
      function guid() {
        function s4() {
          return Math.floor((1 + Math.random()) * 0x10000)
                        .toString(16)
                        .substring(1);
         }
         return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
      }   
    
    }
})();