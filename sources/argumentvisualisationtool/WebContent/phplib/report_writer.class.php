<?php
/**
 * ReportWriter class
 *
 * XXX Solely for the purposes of the IMPACT project. Remove as a core part of
 * the Cohere platform.
 */
class ReportWriter {
  private $_document;
  private $_content;
  private $_sections = array();
  private $_styles = array();
  private $_levels = array();

  /**
   * Constructor
   *
   * @var $document PHPRtfLite rtf document instance
   */
  public function __construct(PHPRtfLite $document) {
    $this->_document = $document;
    $this->_document->setMargins(
      3.17,   // Left
      2.54,   // Top
      3.17,   // Right
      2.54);  // Bottom

    $this->_styles['title']['font'] = new PHPRtfLite_Font(24, Arial);
    $this->_styles['title']['font']->setBold();
    $this->_styles['title']['par'] = new PHPRtfLite_ParFormat();
    $this->_styles['title']['par']->setSpaceBefore(24);
    $this->_styles['title']['par']->setSpaceAfter(24);

    $this->_styles['h1']['font'] = new PHPRtfLite_Font(16, 'Arial');
    $this->_styles['h1']['font']->setBold();
    $this->_styles['h1']['par'] = new PHPRtfLite_ParFormat();
    $this->_styles['h1']['par']->setSpaceBefore(16);
    $this->_styles['h1']['par']->setSpaceAfter(8);

    $this->_styles['h2']['font'] = new PHPRtfLite_Font(14, 'Arial');
    $this->_styles['h2']['font']->setBold();
    $this->_styles['h2']['par'] = new PHPRtfLite_ParFormat();
    $this->_styles['h2']['par']->setSpaceBefore(8);
    $this->_styles['h2']['par']->setSpaceAfter(4);

    $this->_styles['h3']['font'] = new PHPRtfLite_Font(12, 'Arial');
    $this->_styles['h3']['font']->setBold();
    $this->_styles['h3']['par'] = new PHPRtfLite_ParFormat();
    $this->_styles['h3']['par']->setSpaceBefore(6);
    $this->_styles['h3']['par']->setSpaceAfter(3);

    $this->_styles['h4']['font'] = new PHPRtfLite_Font(11, 'Arial');
    $this->_styles['h4']['font']->setUnderline();
    $this->_styles['h4']['par'] = new PHPRtfLite_ParFormat();
    $this->_styles['h4']['par']->setSpaceBefore(4);
    $this->_styles['h4']['par']->setSpaceAfter(2);

    $this->_styles['body']['font'] = new PHPRtfLite_Font(11, 'Arial');
    $this->_styles['body']['par'] = new PHPRtfLite_ParFormat();
    $this->_styles['body']['par']->setSpaceBefore(1);
    $this->_styles['body']['par']->setSpaceAfter(2);

    $this->_styles['bordered']['font'] = $this->_styles['body']['font'];
    $this->_styles['bordered']['par'] = new PHPRtfLite_ParFormat();
    $this->_styles['bordered']['par']->setSpaceBefore(1);
    $this->_styles['bordered']['par']->setSpaceAfter(2);
    $line = new PHPRtfLite_Border_Format(2, '#000000');
    $this->_styles['bordered']['par']->setBorder(
      new PHPRtfLite_Border (
        $this->_document, $line, $line, $line, $line));

    $this->_styles['Issue'] = $this->_styles['h3'];
    $this->_styles['Argument'] = $this->_styles['body'];
    $this->_levels = array('title', 'h1', 'h2', 'h3', 'h4', 'body');
  }

  /**
   * Method to prepare the document
   *
   * @var $content ConnectionSet Contents of the consultation-debate
   */
  public function prepareDocument($content_tree) {
    $content_elements = $this->_writeContentTree(
      $content_tree->root, 0, $content_tree);

    $title_element = array_shift($content_elements);
    $subtitle_element = $this->_newElement(
      'A Summary of Responses', $this->_styles['h1']);

    $title_page = array($title_element, $subtitle_element);

    $this->_newSection($title_page);
    $this->_newSection($content_elements);

    $this->_writeSections();
  }

  private function _writeContentTree($root, $level, $tree) {
    $elements = array();

    $style = $this->_styles[$this->_levels[$level]];
    if (isset($this->_styles[$root->role->name])) {
      $style = $this->_styles[$root->role->name];
    }

    if ($root->role->name === 'Argument') {
      $elements[] = $this->_newElement($root->users[0]->name, $this->_styles['h4']);

      if ($root->is_sct_argument) {
        $elements[] = $this->_newElement(
          'Position: ' . $root->name, $this->_styles['bordered']);
      } else {
        $elements[] = $this->_newElement(
          'Position: ' . $root->name, $style);
      }

      $elements[] = $this->_newElement(
        'Justification: ', $style);
    } else {
      $elements[] = $this->_newElement($root->name, $style);
    }

    $children = $tree->node_children_index[$root->nodeid];
    if (! empty($children)) {
      $next_level = $level + 1;

      // XXX Hack to reverse order of issues so they don't appear backwards in
      // the document. Need a way in the Cohere representation to be able to
      // enforce order on a set of connections.
      if ($tree->node_index[$children[0]]->role->name === 'Issue') {
        $children = array_reverse($children);
      }

      if ($root->role->name === 'Argument') {
        $statements = array();
        foreach ($children as $child_id) {
          $child_node = $tree->node_index[$child_id];
          $statements[] = $child_node->name;
        }
        // XXX Hack to make sure that statements appear in the order
        // Circumstance, Consequence, Value
        sort($statements);

        $elements[] = $this->_newBulletList($statements, $style);
      } else {
        foreach ($children as $child_id) {
          $child_node = $tree->node_index[$child_id];
          $elements = array_merge(
            $elements, $this->_writeContentTree($child_node, $next_level, $tree));
        }
      }
    } else {
      // If it is an Issue with no responses then print 'no responses'
      if ($root->role->name === 'Issue') {
        $elements[] = $this->_newElement(
          'There are no responses.', $this->_styles['body']);
      }
    }

    return $elements;
  }

  private function _newSection(array $elements = array()) {
    $section = new PHPRtfLite_Container_Section($this->_document);

    foreach ($elements as $element) {
      $section->addElement($element);
    }

    $this->_sections[] = $section;
  }

  private function _newElement($text, $style) {
    return new PHPRtfLite_Element(
      $this->_document, $text, $style['font'], $style['par']);
  }

  private function _newBulletList(array $items, $style) {
    $list = new PHPRtfLite_List_Enumeration(
      $this->_document, PHPRtfLite_List_Enumeration::TYPE_CIRCLE,
      $style['font'], $style['par']);

    foreach ($items as $item) {
      $list->addItem($item);
    }
    return $list;
  }

  private function _writeSections() {
    foreach ($this->_sections as $section) {
      $this->_document->addSection($section);
    }
  }

  /**
   * Method to send document as attachment to client browser
   *
   * @var $filename string Name of file that client will download
   */
  public function downloadDocument($filename = 'report') {
    return $this->_document->sendRtf($filename);
  }
}
?>