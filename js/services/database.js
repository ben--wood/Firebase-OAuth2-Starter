/**
 * This is inspired by/ripped off from various bits of LoveField demo code:
 * https://github.com/googlesamples/io2015-codelabs/blob/master/lovefield/src/final/lovefield_service.js
 * https://github.com/google/lovefield/blob/master/demos/olympia_db/angular/demo.js
 * Thank you!
 */

(function () {
    'use strict';

    angular
      .module('app')
      .factory('databaseService', databaseService);

    databaseService.$inject = ['$http', '$log', '$q', '$rootScope', 'FIREBASE_URL', 'TABLE', 'authenticationService'];

    function databaseService($http, $log, $q, $rootScope, FIREBASE_URL, TABLE, authenticationService) {
      var db_ = null;
      var noteTable_ = null;
      var userTable_ = null;
    
      var service = {
        db_: db_,
        noteTable_: noteTable_,
        userTable_: userTable_,
         
        connect: connect
      };

      return service;

      ////////////


      /**
      * Initializes a database connection.
      * @return {!angular.$q.Promise} - promise is resolved when the db_, noteTable_ and userTable_ properties have had values assigned to them 
      */
      function connect() {         
        var deferred = $q.defer();
     
        var connectionOptions = { 
          storeType: lf.schema.DataStoreType.FIREBASE,
          firebase: authenticationService.firebaseRef_ 
        };  
        
        // TODO: check validity of authenticationService.firebaseRef_ - if somehow not valid then logout
        // or if offline do stuff locally and store up firebase calls and issue them all when back online
            
        buildSchema()
          .connect(connectionOptions)
          .then((
            function(database) {
              service.db_ = database;
              service.noteTable_ = service.db_.getSchema().table(TABLE.Note);
              window.db = database;
              deferred.resolve();                     
            }));
                
        return deferred.promise; 
      }

      /**
      * Builds the database schema.
      * @return {!lf.schema.Builder}
      * @private
      * TODO: this is where you would define your database tables
      * https://github.com/google/lovefield/blob/master/docs/spec/01_schema.md
      */
      function buildSchema() {  
        var schemaBuilder = lf.schema.create('Firebase-oAuth-Starter', 1);
        schemaBuilder.createTable(TABLE.Note).
          addColumn('id', lf.Type.STRING).
          addColumn('text', lf.Type.STRING).
          addColumn('dateupdated', lf.Type.DATE_TIME).
          addPrimaryKey(['id']).
          addIndex('idx_text', ['text']);
        schemaBuilder.createTable(TABLE.User).
          addColumn('id', lf.Type.STRING).
          addColumn('email', lf.Type.STRING).
          addColumn('dateregistered', lf.Type.DATE_TIME).
          addPrimaryKey(['id']);
        return schemaBuilder;
      }
      
    }
})();