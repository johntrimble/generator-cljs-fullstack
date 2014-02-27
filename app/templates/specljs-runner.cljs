(ns test.test
  (:require [specljs.run.standard :refer [armed run-specs]]
            [specljs.platform]))

;; Fixes exception strack traces with source maps
(-> "source-map-support" js/require .install)

(set! *print-fn* (fn [thing] (-> js/process
                                 (.-stdout)
                                 (.write thing))))

(defn -main [& args]
  (set! armed true)
  (run-specs :color true))

(set! *main-cli-fn* -main)
