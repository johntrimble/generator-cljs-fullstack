(ns <%= _.slugify(appname) %>.client.client-tests
  (:require [speclj.core :refer-macros [describe
                                        it
                                        should==
                                        should=
                                        should-not==
                                        should-not=
                                        should-not
                                        should
                                        should-not-contain
                                        should-contain]]
            [example.client.core :refer [row-major->columns]]))
            
(enable-console-print!)

(describe "row-major->columns"
          (it "should handle converting collections in row-major order"
              (should= `((1 4 7) 
                         (2 5 8) 
                         (3 6 9))
                       (row-major->columns (range 1 10)
                                           3)))
          
          (it "should underfill columns when necessary"
              (should= `((1 4 7)
                         (2 5)
                         (3 6))
                       (row-major->columns (range 1 8)
                                           3)))
          
          (it "should not explode when column count is greater than item count"
              (should= `((1) (2) (3) (4))
                       (row-major->columns (range 1 5) 10)))
          
          (it "should not explode when the row-major collection is empty"
              (should= '()
                       (row-major->columns '() 3))))
