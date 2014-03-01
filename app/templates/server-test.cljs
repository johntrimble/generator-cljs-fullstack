(ns <%= _.slugify(appname) %>.server.server-tests
  (:require [specljs.core :refer-macros [describe
                                         it
                                         should==
                                         should=
                                         should-not==
                                         should-not=
                                         should-not
                                         should
                                         should-not-contain
                                         should-contain]]
            [<%= _.slugify(appname) %>.server.handlers :as handlers]))

(let [headers (atom {})
      body (atom nil)
      res (js-obj "setHeader" #(swap! headers assoc %1 %2)
                  "end" #(reset! body %))
      req (js-obj)
      result (handlers/hello-handler req res)]
  (describe "hello-handler"
            (it "should set the content type to text/plain"
                (should= "text/plain" (get @headers "Content-Type")))
            (it "should set the content length correctly"
                (should= 11 (get @headers "Content-Length")))
            (it "should say hello"
                (should= "Hello World" @body))))
