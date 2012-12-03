<?php
/**
  Class containing a number of convenient methods for performing tests. Make subclasses to actually perform the tests. 
  @since 18 September 2012
 */
class testItem{

  /**
    Generates an error when the expected result and the actual result are not 
    the same in type and contents
    @param mixed $expectedResult
    @param mixed $actualResult
    @param boolean $strict Indicates whether the types should also be the 
    same in order to trigger an error.
   */
  public static function resultMustBe($expectedResult, $actualResult, $strict = true){
    if($strict){
      $sameResult = $expectedResult === $actualResult;
    } else {
      $sameResult = $expectedResult == $actualResult;
    }
    if(!$sameResult){
      $message = "The results are not the same:\n";
      $message .= "The expected result was of type ".gettype($expectedResult)." and it's contents are:\n";
      $message .= var_export($expectedResult, true);
      $message .= "\n...while the actual result was of type ".gettype($actualResult)." and it's contents are:\n";
      $message .= var_export($actualResult, true);
      $message .= "\n(end of contents actual results)\n\n";
      show_error($message);
    }
  }

  /**
    Generates an error when the disallowed result is the same as the actual result
    @param mixed $disallowedResult
    @param mixed $actualResult
    @param boolean $strict Indicates whether the types should also be the same in order to trigger an error.
   */
  public static function resultMustNotBe($disallowedResult, $actualResult, $strict = true){
    if($strict){
      $sameResult = $disallowedResult === $actualResult;
    } else {
      $sameResult = $disallowedResult == $actualResult;
    }
    if($sameResult){
      $message = "The results are not the same:\n";
      $message .= "The disallowed result was of type ".gettype($disallowedResult)." and it's contents are:\n";
      $message .= var_export($disallowedResult, true);
      $message .= "\n...while the actual result was of type ".gettype($actualResult)." and it's contents are:\n";
      $message .= var_export($actualResult, true);
      $message .= "\n(end of contents actual results)\n\n";
      show_error($message);
    }
  }
}

