(ns test.client-tests
  (:require [specljs.core :refer-macros [describe
                                         it
                                         should==
                                         should=
                                         should-not==
                                         should-not=
                                         should-not
                                         should
                                         should-not-contain
                                         should-contain]]))
(enable-console-print!)

(describe "Arithmetic"
          (it "1 plus 1 equals 2"
              (should== 2 (+ 1 1))))
