(ns test.test
  (:require [speclj.run.standard :refer [armed run-specs]]
            [speclj.platform]))

(set! *print-fn* (fn [thing] (-> js/process
                                 (.-stdout)
                                 (.write thing))))

(defn -main [& args]
  ;; Fixes exception strack traces with source maps
  (-> "source-map-support" js/require .install)
  (set! armed true)
  (.exit js/process (run-specs :color true)))


(set! *main-cli-fn* -main)
